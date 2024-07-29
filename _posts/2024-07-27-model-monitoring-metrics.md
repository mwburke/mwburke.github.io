---
title: 'ML Model Monitoring Metrics'
excerpt: 'Detecting silent model failures early and consistently'
date: 2024-07-28
author: Matthew
image:
  path: /images/placeholder.png
  thumbnail: /images/placeholder.png
category: Data Science
tags:
  - python
  - ml
  - metrics
---
## **ML Model Monitoring Metrics: A Hierarchical Approach to Mitigating Silent Failures**

In the ever-evolving landscape of machine learning, maintaining a fleet of hundreds to thousands of production models can be a daunting task. These models are susceptible to a wide array of silent errors that can go undetected for extended periods. The consequences of such errors can be significant (and expensive).

Model monitoring serves as a crucial defense mechanism against these hidden threats. However, monitoring encompasses a broad spectrum of concerns, from model health to deployment health. In this article, we will focus specifically on model health, which refers to the model's ability to perform as expected in the production environment, rather than identifying issues within the deployment infrastructure.

### **The Hierarchy of Model Monitoring Metrics**

To effectively monitor model health, I generally categorize metrics into three tiers: primary, secondary, and tertiary. They roughly correlate, not to importance per se, but in order of urgency and complexity. Primary metrics are a need to have, secondary are great, and tertiary are valuable in catching other less common failure types not covered by the first two.

#### **Primary Metrics: Model Performance as the Source of Truth**

The cornerstone of model monitoring lies in the primary metrics, which directly measure the model's performance against its intended objectives. These metrics are the gold standard, providing the most accurate assessment of the model's efficacy, and generally correspond to precision/recall, AUROC/PRAUC or specialized metrics such as NCDG for recommender systems.

It is imperative to carefully define these metrics and establish a lower bound threshold that triggers a thorough review. However, relying solely on thresholds can be reactive. A more proactive approach involves trend analysis or point-in-time shift analysis. These techniques allow us to extrapolate the model's performance trajectory, potentially identifying issues before they reach critical levels.One approach I have seen is to establish an initial threshold that suggests review, and a second threshold closer to the unacceptable failure metric that can be considered urgent and requiring action.

##### **Why Use Other Metrics?**

In many real-world scenarios, there can be a significant lag between the time a model makes a prediction and the time the corresponding ground truth data becomes available. This delay can be attributed to various factors, such as manual feedback loops, long-term user behavior patterns, or infrastructural limitations. In such cases, relying solely on primary metrics can lead to delayed detection of model degradation.

##### **The Role of Proxy Metrics**

To address this challenge, I want to introduce proxy metrics, which serve as substitutes for primary metrics. Proxy metrics have a shorter measurement lag and exhibit a high correlation with the target metric. One example would be using 30-day activity as an indicator of long-term (yearly or longer) engagement. Clearly, they will be related, but correlation will not be perfect due to the expansive time involved in the main metric. We choose a metric with less precision in order to be more agile with our decision making process.

However, it's crucial to exercise caution when selecting and interpreting proxy metrics. The relationship between a proxy metric and the target metric can shift over time due to changes in the underlying data distribution or model behavior, and it should be reviewed on a regular basis.

##### **The Importance of Segmentation**

In addition to overall performance metrics, it is often valuable to segment the data and monitor the model's performance across different groups or cohorts. This approach can reveal performance disparities that might be masked by aggregate metrics. For instance, a model might perform well overall but exhibit suboptimal performance for a specific demographic or user segment. Identifying such disparities is crucial for ensuring equitable outcomes and maintaining trust in the model's predictions.

#### **Secondary Metrics: Drift and Data Quality**

Secondary metrics, including drift and data quality metrics, play a vital role in early detection of potential model issues. These metrics can be computed rapidly and provide valuable insights into the model's health.

##### **Data Quality Checks**

Data quality checks encompass a range of measures, including data freshness, null values, and out-of-range errors. While some of these checks can be automated using default values, it is often beneficial to customize them for specific features, particularly those that are critical to the model's performance.

One challenge in data quality monitoring is determining how to handle errors in models with a large number of features. It is impractical to manually review every error for every feature. However, logging all data used in predictions, even after anonymization, can provide a valuable resource for post-hoc analysis and troubleshooting.

##### **Output Drift as a Canary**

Output drift, which refers to changes in the distribution of the model's predictions over time, can be a strong indicator of conceptual drift. Conceptual drift occurs when the underlying population of the model making predictions for shifts, or the relationship between the target and the input data, changes.

Imagine a model as a hiker trying to reach the highest point on a landscape. The model finds a peak and settles there during training. However, over time, the landscape changes. Even if the model's performance metrics remain high, it might no longer be at the optimal peak. Output drift is like noticing that the surrounding scenery has changed, signaling that it might be time for the model to explore and find a new peak.

##### **Input Drift**

Input drift, which tracks changes in the distribution of the input data, complements output drift. It can help detect unexpected shifts caused by upstream or downstream product changes and pinpoint the source of output drift. However, input drift is often underutilized due to uncertainty about how many alerts warrant investigation.

Additionally, this can be seen as unnecessary if output drift is also being monitored. The main use case is in either rule-based systems, systems where the model predictions aren’t readily available, or the predictions are being made on a sub-population of entities that are filtered based on input features. Measuring input drift can alert the model maintainer to revise the thresholds used in entity selection, even if the primary model metrics are still performing within expectations.

#### **Tertiary Metrics: Checking for Unusual Errors**

Tertiary metrics focus on identifying unusual patterns or errors in the model's predictions. These metrics can provide valuable clues about potential issues that might not be captured by primary or secondary metrics.

##### **Spike in Identical Predictions**

A sudden increase in the number of predictions with the same value can be a red flag. This phenomenon might indicate an issue with an upstream data source, such as a data pipeline error or a change in the data collection process.

##### **SHAP Feature Importance Shifts**

SHAP (SHapley Additive exPlanations) feature importance, which quantifies the contribution of each feature to the model's predictions, can also be monitored over time. Significant shifts in feature importance can indicate drift, albeit in a more subtle way than output or input drift. However, interpreting and acting upon such shifts can be challenging.

##### **Bias and Fairness**

Monitoring for bias and fairness is essential to ensure that the model's predictions are equitable and do not discriminate against certain groups. This involves assessing the model's performance across different demographic groups and identifying any disparities in outcomes.

##### **Calibration**

Calibration metrics, such as Expected Calibration Error (ECE) or Brier Score, assess the agreement between the model's predicted probabilities and the observed outcomes. A well-calibrated model assigns probabilities that accurately reflect the likelihood of the predicted event occurring.

### **Final Thoughts**

Model monitoring is difficult in that it requires a thorough understanding of the models’ application, data availability, and stakeholders’ risk tolerance. There aren’t always clear guidelines on what metrics should generate an investigation/model retrain, but neglecting to implement monitoring due to indecision should be unacceptable to modern companies operating at scale. The cost of not doing could easily outweigh the cost of developing and maintaining proper monitoring solutions.
