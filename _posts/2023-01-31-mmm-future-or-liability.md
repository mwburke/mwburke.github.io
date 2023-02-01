---
title: 'MMM: Miracle of Marketing Measurement or Misleading  Modeling Methodology?'
excerpt: MMMs are a future-proofed tool for measuring marketing effectiveness in a world of increased online privacy, but can be prone to multiple silent failure methods that provide inaccurate results.
date: 2023-01-31
image:
  path: /images/mmm_0.png
  thumbnail: /images/mmm_0.png
category: Data Science
tags:
  - ml
  - marketing
---

# MMM: Miracle of Marketing Measurement or Misleading  Modeling Methodology?

## TL;DR

MMMs are a future-proofed tool for measuring marketing effectiveness in a world of increased online privacy, but can be prone to multiple silent failure methods that provide inaccurate results.

## What is an MMM?

Media mix modeling is a statistical technique used to understand the effectiveness of different advertising and marketing channels, such as television, print, digital, and so on. The goal of media mix modeling is to determine the optimal allocation of a company's advertising budget across different channels to maximize the return on investment (ROI). This is done by analyzing historical data marketing expenditures and conversions, and using statistical models to estimate the incremental  impact of different advertising channels on conversions.

Businesses use media mix modeling to gain insights into the effectiveness of their advertising campaigns and to make data-driven decisions about where to allocate their advertising budget. By understanding the ROI of different advertising channels, companies can optimize their marketing strategy to maximize their sales and revenue. Additionally, media mix modeling can also help businesses identify underperforming channels and make adjustments to their advertising strategy accordingly. It also can help them to understand the changes of the market and the effectiveness of their strategy.

## Privacy Proof?

If you haven’t noticed the incessant cookie tracking messages on every website, the world is heading on a trend of increased data privacy online due to legislation such [GDPR](https://gdpr-info.eu/) or  [CCPA](https://oag.ca.gov/privacy/ccpa), and Apple’s [iOS 14](https://developer.apple.com/app-store/user-privacy-and-data-use/) privacy changes. What this means for advertisers is that they will receive less and less user impression level data. While your company may still be able to extract aggregate-level insights from [data clean rooms](https://www.appsflyer.com/resources/guides/data-clean-rooms/), mapping conversions to specific users will no longer be possible. The most obvious impact is removing the possibility of maintaining a [multi-touch attribution](https://segment.com/academy/advanced-analytics/an-introduction-to-multi-touch-attribution/) pipeline to assign credit to user impression for conversions.

### Evergreen Data

MMMs, however, don’t rely on user-level data, and instead rely on first party data that companies will always have: namely what money went where. Marketing teams will always have budgets to track what advertising dollars were spent on which channels and campaigns, as well as conversions tracked to report revenue. These are the core data that are fed into an MMM, and as such, I don’t see them disappearing at any point in the future. In some cases, impressions are often preferred over marketing spend as input data to the model due to reducing fluctuations in advertising CPA, but my guess is that advertisers will continue to provide at least a high level estimation of impression magnitude to keep their customers happy.

## The Pitfalls

With our options for measurement dwindling, why be pessimistic about MMM? It seems like the one stable methodology that will see widespread use. The main reasons revolve around the fact that it’s a small data problem with a big emphasis on slow but precise data collection, and the potential for silent methodology errors.

### Lack of Quality Data Input

#### Not Enough Data

Data collection can’t be rushed or automated with label training, but is collected naturally over time as your company markets its products or services. For some digital channels/advertisers, you may be able to collect both spend and impressions data down to a daily basis, whereas for traditional non-digital channels such as mail or print, you may be limited to a monthly cadence.

Given that your data inputs must be fed into the model at the least granular level, your company may take years to gain enough data to reliably estimate performance. Assume for example that you want to estimate the carryover and saturation effects at a channel level, and depending on the fit forms you use to model them, this could be from 2-5 parameters for each channel. If you have 10+ channels, you can see how this will take a length amount of time until you even have more data points than parameters, let alone to reduce uncertainty to a reasonable amount.

New channels equally struggle with this problem of small data and extracting seasonal effects. Often, one solution for this is to perform additional testing and apply the derived assumptions rather than inferring parameters.

#### Not Enough Data Variance

One rookie mistake new marketing divisions may make is to spend proportionally on channels month over month. Although the total spend in a time period may shift, if you spend the same proportions in each channel over time, you end up not having enough variance between channels and end up with an entirely collinear dataset. Any model building after that will run into serious, unresolvable modeling issues. This is just a classic example of the explore/exploit paradigm where you need to add enough randomness to discern between channels while still maximizing profit. Fortunately, there may be natural barriers through ad planning and payment that prevent this issue entirely, but it’s something to monitor from a central planning team.

#### Missing Covariates

Marketing spend only accounts for a portion of all conversions with the remaining conversions being attributed to a number of control factors. These could include natural, brand recognition, economic factors, total available market, competitor advertising/brand effects, etc. Without knowledge beforehand whether they correlate with your target, it can be difficult to decide whether or not to invest in data collection or purchase. Sometimes known factors may be unavailable due to timing granularity or proprietary access. From my point of view, this is the primary reason using a third party vendor to build an MMM is valuable, because their expertise and data collection infrastructure may overcome some of these limitations and augment your data with crucial factors.

### Misinterpretation and Misspecification

MMMs have been around for a long time, and the amount of domain expertise developed has led to a few common solutions being preferred. The technical implementation of those has become almost trivial, and, in my opinion, the design of your model is entirely based around the set of assumptions you apply. This is advantageous if you fully understand the problem space, but without appropriate experience or data access, a lot of these assumptions will have to be made in an ad hoc manner or on gut feel.

#### Domain Assumptions

Before delving into the modeling process, you have to specify a number of domain specific assumptions including whether or not channel advertising effects are additive or multiplicative and what functional forms saturation curve and carryover lag effects should take. It would take extensive  time and resources to actually test and validate all of these assumptions, and, unless you’re a large marketing firm that is providing MMM as a service, it’s unlikely you will ever be able to validate your assumption choices. In this case, you are accepting a risk of building a model that doesn’t correspond to reality and will always be wrong in an unmeasurable amount, but from what I’ve seen when reading guides and resources online, this risk isn’t highlighted nearly enough.

#### Forecasting Assumptions

Well-specified MMMs take into account non-media control variables to isolate incremental conversions from marketing spend from all other effects. In my experience, planning based on MMM results takes into account only the incremental marketing ROI measurements and fails to consider all of the control variables used as well. However, just as in life, no decision is still a decision, and not taking any changes into account is close to extrapolating the current situation forwards. I’m not necessarily saying that trying to predict future economic conditions given the volatility of Covid, inflation, recession (?), and interest rates is advisable or even possible, but focusing entirely on media effects is just another way to have silent, unmeasurable errors.

#### Understanding Time Period Application

Most MMMs until now have tended to use all historical time periods in the modeling process, and to update it, data  since the last run is collected and appended to the full dataset. The outputs are analyzed and used to optimize marketing spend for an upcoming period, commonly a few months out. The fact that we are only learning a set of parameters for each channel over the whole time is highly concerning to me, given how we know that businesses shift their strategies, advertising effectiveness and scale (hopefully) over time. Yes, if the curve was static, we would be gaining more data points on curve and decreasing our uncertainty in our estimate, but assuming that all channels’ parameters have remained constant over months or years seems unreasonable to me.

There seem to be two main methods of combatting this issue. The first is [recency weighting](https://stats.stackexchange.com/questions/454415/how-to-account-for-the-recency-of-the-observations-in-a-regression-problem), which is a method of giving larger importance to later observations in inferring channel parameters, and while it is still able to leverage learnings from earlier time periods, it better represents recent trends to help align with planning. The other [time varying coefficients](https://arxiv.org/pdf/2106.03322.pdf) which captures the parameter at different points in time, and seems to me to be powerful enough to become standard practice for MMM.

## Conclusion (aka My Bad Opinions)

MMM still can enormously useful but requires thoughtful planning and review from domain experts and data scientists before digging into the actual modeling portion. If you can't provide that level of support for data and assumptions validation, it may make more sense for you to purse a third-party marketing firm to leverage their skills instead.

The good news is that big tech seems to be realizing the adpocalypse is continuing and are beginning to invest in MMM tools. Here are some that I think are valuable:

- [Google’s Lightweight MMM](https://github.com/google/lightweight_mmm)
    - This is a pretty feature complete python package for building Bayesian MMMs
    - It has convenient features such as geo-level modeling, preprocessing and budget optimization
- [Facebook’s Robyn](https://facebookexperimental.github.io/Robyn/)
    - Very powerful and feature rich MMM building tool in R.
    - In my opinion, this seems like the best option for developing your own MMM if you have resources to dive deep into it and aren’t full committed to only python
- [Uber’s Orbit](https://github.com/uber/orbit)
    - This is a python library that implements the bayesian time-varying coefficients for time series forecasting
    - If you want less functionality and are prioritizing time varying coefficients, this is the library for you
    - Not a MMM-specific library so you are missing a lot of the preprocessing and diagnostic tools found in Robyn, but if you are willing to implement those yourself (they aren’t rocket science), then this is a great option

I mostly put this together to capture areas of discussion around MMM that I felt weren’t being addressed properly, and if you have any tips on addressing these problems, please feel free to share them here or elsewhere on the internet. I’m sure lots of folks are working on the same types of problems and increasing literature around the practical development of MMMs would help the industry a ton.
