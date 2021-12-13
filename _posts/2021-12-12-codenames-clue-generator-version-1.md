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

### Cosine Similarity - Word Relevance

There are a number


# Resources

- Word Embeddings:
    - [Machine Learning Mastery: What Are Word Embeddings](https://machinelearningmastery.com/what-are-word-embeddings/)
    - Tensorflow has a [guide to working with embeddings](https://www.tensorflow.org/text/guide/word_embeddings) in a neural network for those who work in ML/NLP.
- [Cosine Similarity](https://en.wikipedia.org/wiki/Cosine_similarity)
-
