---
title: 'Multi-Armed Bandits Exploration'
excerpt: 'Benchmark Comparisons and UCB Visualization'
date: 2019-06-18
image:
  path: /images/placeholder.png
  thumbnail: /images/eps_greedy_rewards.png
category: Data Science
tags:
  - python
  -
---

## Multi-Armed Bandit Overview

A multi-armed what?? If you don't know what the multi-armed bandit problem is, then you may be confused. I'm assuming that you have some background on this for the rest of the post, but if you don't, here's a quick rundown:

Pretend you are a someone who's looking to go gambling, and there are X number of slot machines (aka bandits, don't worry about why) you can choose from. Your goal is (obviously) to make the most amount of money from putting coins into them. However, given that you can only try one bandit at a time, how do you find the bandit(s) that give you the most bang for your buck without wasting time machines that just eat your money?

That's essentially what the multi-armed bandit problem is. How do we maximize rewards by _exploring_ new bandits we don't know much about (have only played zero or a few times), while still _exploiting_ (or taking advantage of) the bandits we already know give us good rewards?


Alright, now that we've covered that, we can jump into some code and ways I explored common algorithms used to maximize profits in this scenario.

## Bandit Definitions

But first, let's look again at how the bandits themselves are defined. I played around with two types:

1. __Bernoulli Bandit__: each bandit has a set probability each time it's pulled of returning a reward of 1 or 0
2. __Gaussian Bandit__: each bandit has a mean and standard deviation that define a gaussian distribution. When pulled, it samples from that distribution to return a reward.

Here's a quick visualization of means and a standard deviation away from those means to get an idea of the potential overlap in rewards you may get from the gaussian bandits. The x axis is the bandit number, and the y axis is the reward distribution.

![](/images/gaussian_rewards.png)

Clearly bandits 3-4 are the highest ones, but their rewards still overlap greatly with 2, and it would be tricky to tell which one is best, given the amount of noise when sampling.

## Execution

The methods to choose arms in a programmatic away could be called methods or algorithms or whatever, but since I've been exploring reinforcement learning recently, I'm going to call them agents.

At each timestep a few things happen:

1. The agent evaluates its current stored information and chooses a bandit to interact with
2. The agent pulls the chosen bandit and receives a reward in return
3. The agent makes updates to its stored information based on the reward

### Evaluation Procedure

In the following section, I compare agents with different parameters to each other by running an agent against a particular set of bandits for a pre-defined number of timesteps repeatedly. By doing this multiple times and tracking the rewards at each timestep, we can get a sense of what average performance we can expect from the agent at each timestep.

Naturally, we should see lower average rewards earlier on since we are still exploring and are uncertain of which bandits provide the best value, but what we hope to see is a gradual increase in rewards until we identify the optimal arm, at which point the rewards should flatten out to the average of the optimal arm's reward.

The two plots I include each with the comparisons track both of the metrics over time:

1. Average reward at each timestep
2. Percent of times the agent chose the optimal arm at that timestep

As you will see, the former can be a rather noisy chart (especially with gaussian reward functions), but the latter results in a smoother chart.

## Agents

### Epsilon Greedy

The epsilon greedy agent is an agent is defined by two parameters: epsilon and epsilon decay.

Every timestep, the agent generates a random number between 0 and 1, and if the value is below epsilon, then the agent selects a random bandit. Otherwise, it chooses the bandit with the highest average reward (breaking ties randomly), thus exploiting what it knows.

A higher epsilon results in more exploration (random arm selections), and a lower epsilon results in more exploitation.

Because we may not want to keep the same epsilon over the life of our problem, we introduce the epsilon decay parameter, which decreases the value of epsilon after each timestep. This naturally lends itself towards a high explore approach at the beginning when we are unsure of the bandit rewards, and a high exploit approach later on once we have more information.

In theory, this seems like a good idea, but in practice (with noisy bandit rewards), decaying epsilon seems to have slightly lower performance. However, I did not implement a minimum epsilon, which could help by preventing a fully-exploit scenario.

Below is a comparison of some different parameters of epsilon greedy agents:

![](/images/eps_greedy_rewards.png)

![](/images/eps_greedy_optimal_arms.png)

Here is a comparison of the best decay rate I found (ratio of 0.9999 per timestep) with different starting epsilon values.

![](/images/eps_greedy_decay.png)

### UCB

The upper confidence bound (UCB) agent tracks the average reward for each bandit similar to epsilon greedy, but rather than encoding its exploration as a binary random chance, it attempts to measure uncertainty in terms of how long it has been since a bandit has been chosen.

Each timestep, the agent chooses the arm with the highest average reward plus "uncerainty", and the uncertainty for each arm not chosen increases a little bit.

Earlier on, every timestep where a bandit is not chosen increases uncertainty by a significant amount. As the system time grows, the uncertainty contributed by each timestep decreases since we should have more accurate estimates of rewards as time progresses.

An important note is that this uncertainty is not what we normally think of in statistics and is **not related to the variance of the reward estimates**.

The influence of the uncertainty factor is determined by a parameter C. Below is a comparison of some runs with different values of C:

![](/images/ucb_pct_arms.png)

One of the main purposes of this repo was to help visualize the UCB agent, in terms of how it balances the average rewards received so far and the uncertainty of unused bandits.

Below is as gif of a UCB agent in action. Each frame in the gif is a step where the agent chose an action, received a reward, and updated its estimates/uncertaintities for each bandit.

The blue parts of each bar are the average rewards for that bandit, and the orange parts are the uncertainty. You should be able to see the blue parts jump around as the highest total blue + orange bandit is pulled, while the non-pulled bandits' orange parts should steadily increase until they become the highest bars.

At first, the values will most likely jump around more as the variance of the reward estimates is large, but as it progresses, it should settle into selecting a few bandits repeatedly until there is one main winner.

![](/images/ucb_race_gif.gif)

### Gradient Method

The prior two algorithms choose arms based on the average score values, selecting the highest performing one (with some initial exploration). Gradient-based algorithms instead relies on relative preferences for each arm that do not necessarily correspond to actual rewards values. At each timestep, the rewards for an arm are observed, and then an incremental update to the existing preference score is made based on new score and a parameter alpha. This is similar to stochastic gradient ascent, and a larger alpha will result in a larger step size.

The details for updating the preference values $$H_{t}(a)$$ for selection probabilities $$\pi_{t}(a)$$ selected action $$A_{t}$$, rewards $$R_{t}$$, and average reward $$\overline{R_{t}}$$ are as follows:

$$H_{t+1}(A_{t}) = H_{t}(A_{t}) + \alpha (R_{t} - \overline{R_{t}})(1 - \pi_{t}(A_{t}))$$ for action $$A_{t}$$ and

$$H_{t+1}(a) = H_{t}(a) - \alpha (R_{t} - \overline{R_{t}})\pi_{t}(a)$$ for other actions $$a \neq A_{t}$$

When choosing an arm, the agent passes these arm preferences through the softmax distribution to assign weights to all arms that add up to one. These weights are the probabilities that each arm is chosen. After each step, the average rewards are updated, then the weights for sampling are recalculated.

In case you aren't familiar, the softmax distribution is as follows: $$ P\{A_{t} = a\} = \frac{e^{H_{t}(a)}}{\sum_{b=1}^k e^{H_{t}(b)}} $$

One thing to note is that the average rewards at the start before any weights are input affects the results. Starting all arms out with a value greater than zero will still have an effect of an equal chance for all arms to be selected, but will encourage more exploration in the short term before potentially lowering poorly performing probabilities of being selected almost to zero.

![](/images/gradient_pct_arms.png)

## Interactive Notebook

I created a [github repo](https://github.com/mwburke/bandits) with all of the code used to generate these plots, with a [notebook](https://github.com/mwburke/bandits/blob/master/walkthrough.ipynb) ready to to re-run them and change any parameters so you can get an intuition about how some of these common agent algorithms work.

I'd highly recommend playing around with different numbers of bandits, bernoulli rewards, and various levels of noise in the gaussian rewards by increasing and decreasing the standard deviation compared to the means.
