---
title: 'Codenames Clue Generator using Semantic Similarity'
excerpt: 'Utilizing Tensorflow pre-trained embeddings to recommend potential clues to the codemasters in the card game Codenames'
date: 2021-12-12
image:
  path: /images/codenames_cover.jpg
  thumbnail: /images/codenames_cover.jpg
category: Data Science
tags:
  - python
  - ml
  - tensorflow
---
In this post, I'll talk about how I built a clue generator for the game Codenames that provides a list of potential clues, numbers and associated target words, all with Tensorflow.

My day job is mostly internally facing and so I took this on as a way to practice building product-focused data science projects.

# How Codenames Works

If you already know how the game works, feel free to skip or read again for a quick reminder.

Codenames is a card game with 2 teams. There are 25 cards laid out on the board, 9 belonging to one team, 8 belonging to another, 7 neutral and 1 double agent card.

Each time has a **codemaster** that can see which cards belong to which teams, and the remaining members of the teams are **spies** that only see a single word on each card.

The teams take turns having the codemaster provide a clue to their team made up of a single word and a number, with the clue relating to the number of cards on the board. The goal is to get the team to guess which words the clue is indicating, and they select cards to turn over.

If they select a card belonging to their team, they can continue guessing, but if they flip over a card that doesn't, their turn is immediately ended and they could suffer the negative consequences of potentially flipping over the other team's card, bringing them closer to their goal, or flipping over the double agent card and instantly losing the game.

Thus, the codemaster seeks to find clues that maximize the relationship to words on their team and minimize the relationship to words on the other team. Additionally, by finding clues with a larger number of cards it relates to, they can increase their chance of beating the other team by finishing first, but they risk having a lower relevance to each of the target cards and higher chance of accidentally missing a connection for opposing cards.

# How I Built It

## Project Goals

We represent a current board and team state with the following inputs:

- Current team's cards
- Opposing team's cards
- Neutral cards
- Double agent card

What we are looking for is a list of potential clues the codemaster could use with the following fields:

1. Clue word
2. Clue number
3. Target words the clue is intended to relate to
4. Quantitative measure of the quality of the clue

## Quantifying Clue Quality

As with most data science problems, the hardest part if quantifying exactly what you are looking to maximize or predict. In this case, we have a vague notion of maximize and minimizing relevance of our clue word to words on the board. While there are many ways to do this, the way I chose to frame it for now is in terms of embeddings.

### Word Embeddings

[Word embeddings](https://en.wikipedia.org/wiki/Word_embedding) are a way to represent words quantitatively with a list of numbers, which we will refer to here as a vector. The main idea is that words with similar meanings will have similar number representations, and that related words will have a similar relationship. For example, woman -> man should have a similar relationship as queen -> king. Or Pooh -> Tigger should have a similar relationship as bear -> tiger (ok maybe this one's a bit of a stretch, but you get the picture).

Rather than generating my own, I used a pre-trained model from Tensorflow, the [Wiki-words-500](https://tfhub.dev/google/Wiki-words-500/2) text embedding that already generated a mapping from words to their vector representations. I now have a function to translate any given english word into a vector of length 500.

Please see the end for discussions about future improvements related to choosing a embedding corpus.

### Word Relevance - Cosine Similarity

Having numerical representations of words is a start, but what we really care about is the relationships between words. We need to compare the vectors to begin to use them.

When comparing vectors, you will often hear the language of **distance** and **similarity**, which are two sides of the same coin, meaning difference and closeness of two vectors, respectively. For certain types of distances, we may just subtract the value from one to switch between the two.

For this case, I chose to work with [cosine similarity](https://en.wikipedia.org/wiki/Cosine_similarity), although I may look into other options in the future. This gives us a single number ranging from -1 to 1, with -1 indicating two words' being as dissimilar as possible and 1 being equivalent.

### Clue Quality Metric

In order to summarize clue quality in a single number, we consider the benefits and penalties associated with the outcome of guessing a card on the table. Obviously, we want to incentivize choosing clues that are relevant to our team and decentivize other cards, with increasing penalties for the undesirable outcomes. Neutral ends our turn, the opposing team's card ends our turn and advances them to the goal, and the double agent loses the game.

The way we summarize this is by multiplying the cosine similarity for each card on the table by a set of coefficients that represent these benefits/penalties. The process is as folows:

1. Extract word bank embeddings and cache since they will be reused for all games
2. Get current game word embeddings
3. Calculate cosine similarity between all game words and all word bank words
4. Multiply similarity scores by appropriate card type coefficients
5. Sum up all final scores for each word bank word to get clue quality metric

This can all be accomplished very quickly with Tensorflow using their pre-trained embeddings and a series of matrix multiplications.

#### Clue Size

We do have an additional constraint to limit the number of words that the clue relates to, which changes how we think about the quality metric. The overall structure remains the same, but we need some way to determine which of our team's cards to include in the clue.

The way I implemented it was to set a similarity threshold and only keep clues that have a similarity value equal to or greater than the threshold. This is the most straightforward way, and it ensures a global level of relevance. Of course, this introduces another parameter to tweak that we don't have an exact way to measure the effectiveness of, and we do run the risk of excluding relevant clues that fall right below the cutoff. However, as problems go, having your team select another one of their cards is a decent one to have, although it may cause confusion later down the line.

The above process for calculating the quality metric remains the same as above, but, first we go through and remove all cards below the similarity threshold, and then calculate the contribution of the remaining ones towards our metric.

#### Setting Coefficients

It's clear that we want a positive coefficient for our cards and monotonically decreasing negative coefficients for opposing, neutral and double agent cards respectively, but it's not obvious exactly what they should be for several reasons:

1. All of the coefficients are relative to one another so there isn't a single global optimum
2. We are codifying the codemaster's risk preferences to a single set of numbers
  - Some people may have a higher risk tolerance for clues similar to the double agent card, or they may never want to even have a small chance of guessing it
3. The number of cards in each category changes over the course of the game
  - We may need to scale the contributions of remaining team/opposing cards. If both teams are guessing accurately, there will be few cards belonging to them and a higher concentration of neutral cards.
  - This may dilute the quality metric by having it be mostly composed of negative scores. The clues will mostly be avoiding the other cards rather than leaning towards the remaining cards
  - It remains to be seen if this problematic, or if at that point, the codemaster no longer needs to rely on a clue generator since the problem space is much smaller
4. We don't have a clear metric on how to evaluate the effectiveness of the metric as of now

## Solution Validation / Testing Plans

Number 4 above is the elephant in the room: **How do we know our solution is effective?**

The ideal method would be to test a bunch of games with randomly assigned teams, and provide the test teams with access to the clue recommendations. Our expectation is that the win rates would be equal between groups, and any significant difference would be driven by access to the tool. I would rather test giving tool access, but not mandating usage, because that's a more realistic scenario in practice than forcing them to use the top recommendations every time. At this point, I don't think we would consistently beat player intuition, so it's not a valid comparison. However, the time required to get volunteers and acquire data seems impractical, so are there any other ways we can perform testing?

### Backtesting

If you run a codenames online site with textual clue inputs, you could backtest and see how many times the clues recommended by users would have been recommended by the tool.There are multiple metrics used in recommender systems you could use to evaluate performance including [NDCG](https://en.wikipedia.org/wiki/Discounted_cumulative_gain) or an adapted version of [Mean Average Precision](http://sdsawtelle.github.io/blog/output/mean-average-precision-MAP-for-recommender-systems.html).

Regardless of what method you use, there are several problems:

1. Sometimes people give bad clues. I've done it, others do it. It's fairly common. How will this affect our scores?
  - We could potentially do some censoring to only include clues where the codemaster's team guessed all of the associated words correctly if we had access to it. We could determine whether or not they guessed the correct amount of clues, but as far as I've seen, online sites don't seem to have tagging for relevant words to clues. At the very least, it would be a more fair comparison, even if there's still a known source of error.
2. The recommender word bank may include many words not in the common vernacular that are still relevant. Should they be penalized just because they're niche?
3. We don't have any proper nouns in our word bank. These can be very effective: think Potter for ceramic and magic as an example.

### Mechanical Turk

A common way to generate datasets for bespoke targets is through [Amazon Mechanical Turk](https://www.mturk.com/) , where you can get people to complete arbitrary tasks online for money. This often is used in ML to generate labels for unsupervised data such as images or natural language.

In this case, proper evaluation takes a fair amount of background understanding of the game just to be able to make evaluations, and for accurate evaluations, experience actually playing. Given the cost of getting random people to take time to learn a new game, confirm that their understanding is accurate, and then to actually play test games would be exorbitant, we need to modify our method into easier to consume subtasks that are proxies for clue quality.

I propose that we could potentially focus on getting people to evaluate clue similarity or dissimilarity to a set of words. This could be done either as choosing the most/least relevant clue to a set of words from a list of potential clues, or providing a clue and bank of words, and having them choose the most/least relevant words to the clue. This removes the need to evaluate multiple objectives simultaneously, and increases the amount of data we could collect per dollar. Evaluation would be between existing versions of the clue generator, or between existing game samplesa dn the clue generator.

Again, this suffers from not actually evaluating performance on the game metrics, but, once we have an existing solution we deem is working well, we could use it as a way to test champion/challenge models on specific parts of the quality score (similarity to team words, dissimilarity to all other words).

# Future Work

If not obvious by now, there are a lot of potential areas for improvement that I would like to pursue given time, but here are some of the main ones:

## Graph-Based Similarity

The current approach suffers from words with multiple meanings, the curse of dimensionality, a lack of concrete, objective measurements of similarity, and proper nouns in the word bank.

Switching to a knowledge graph, or even web-search [PageRank](https://en.wikipedia.org/wiki/PageRank) like approach would help shore up the above problems and maybe be used in tandem with semantic similarity recommendations if not replacing it entirely.

## Word Embeddings

- Additional research into more appropraite pre-trained word embeddings
- Generate our own embeddings by training an NLP model on a corpus we designed for this

## Quality Metric

- Add a relative score component for clue selection
  - Using an elbow method similar to identifying the appropriate number of clusters?
- Scaling based on number of cards still available to deal with clue dilution of team's cards compared to other cards



# Resources

- [Codenames Online Game](https://codenames.game/)
- Word Embeddings:
    - [Machine Learning Mastery: What Are Word Embeddings](https://machinelearningmastery.com/what-are-word-embeddings/)
    - Tensorflow has a [guide to working with embeddings](https://www.tensorflow.org/text/guide/word_embeddings) in a neural network for those who work in ML/NLP.
- [Cosine Similarity](https://en.wikipedia.org/wiki/Cosine_similarity)
