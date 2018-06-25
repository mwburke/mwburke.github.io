---
layout: post
title: 'Stargazer: Multiple Regression Reporting | worksofchart.com'
date: 2018-06-24
author: Matthew
cover: 'https://i.stack.imgur.com/G0hV4.png'
tags: python regression stargazer r experiments
---

<script>
	var element = document.getElementsByClassName("stargazer");
	element.classList.remove('markdown-body')

</script>


## Introducing the Stargazer Python Package:

I really like the [stargazer package in R](https://cran.r-project.org/web/packages/stargazer/vignettes/stargazer.pdf). It's a fantastic library for creating beautiful, publication worthy regression tables, and I was bummed when they didn't have a version in Python which is what I'm primarily working in these days. So.. naturally I created my own implementation and figured I would share it since there must be some others who love both R and Python out there and are looking for feature parity between the two. It  probably has a few bugs but I figured something was better than nothing. Here's an example of the output from my current version (with my blog styling automatically applied). 
<div >
<table class="stargazer"><tr><td colspan="3" style="border-bottom: 1px solid black"></td></tr><tr><td style="text-align:left"></td><td colspan="2"><em>Dependent variable:</em></td></tr><tr><td style="text-align:left"></td><tr><td style="text-align:left"></td><td>(1)</td><td>(2)</td></tr><tr><td colspan="3" style="border-bottom: 1px solid black"></td></tr><tr><td style="text-align:left">ABP</td><td>416.674<sup>***</sup></td><td>397.583<sup>***</sup></td></tr><tr><td style="text-align:left"></td><td>(69.495)</td><td>(70.87)</td></tr><tr><td style="text-align:left">Age</td><td>37.241<sup></sup></td><td>24.704<sup></sup></td></tr><tr><td style="text-align:left"></td><td>(64.117)</td><td>(65.411)</td></tr><tr><td style="text-align:left">BMI</td><td>787.179<sup>***</sup></td><td>789.742<sup>***</sup></td></tr><tr><td style="text-align:left"></td><td>(65.424)</td><td>(66.887)</td></tr><tr><td style="text-align:left">S1</td><td></td><td>197.852<sup></sup></td></tr><tr><td style="text-align:left"></td><td></td><td>(143.812)</td></tr><tr><td style="text-align:left">S2</td><td></td><td>-169.251<sup></sup></td></tr><tr><td style="text-align:left"></td><td></td><td>(142.744)</td></tr><tr><td style="text-align:left">Sex</td><td>-106.578<sup>*</sup></td><td>-82.862<sup></sup></td></tr><tr><td style="text-align:left"></td><td>(62.125)</td><td>(64.851)</td></tr><tr><td style="text-align:left">const</td><td>152.133<sup>***</sup></td><td>152.133<sup>***</sup></td></tr><tr><td style="text-align:left"></td><td>(2.853)</td><td>(2.853)</td></tr><td colspan="3" style="border-bottom: 1px solid black"></td></tr><tr><td style="text-align: left">Observations</td><td>442.0</td><td>442.0</td></tr><tr><td style="text-align: left">R<sup>2</sup></td><td>0.4</td><td>0.403</td></tr><tr><td style="text-align: left">Adjusted R<sup>2</sup></td><td>0.395</td><td>0.395</td></tr><tr><td style="text-align: left">Residual Std. Error</td><td>59.976(df = 437.0)</td><td>59.982(df = 435.0)</td></tr><tr><td style="text-align: left">F Statistic</td><td>72.913<sup>***</sup>(df = 4.0; 437.0)</td><td>48.915<sup>***</sup>(df = 6.0; 435.0)</td></tr><tr><td colspan="3" style="border-bottom: 1px solid black"></td></tr><tr><td style="text-align: left">Note:</td><td colspan="2" style="text-align: right"><em>p&lt;0.1</em>; <b>p&lt;0.05</b>; p&lt;0.01</td></tr></table>
</div>

Here's an example of a raw example without any styling I generated using the package:

![](/assets/img/stargazer_example.png)

## Wait a second... these aren't charts

You are correct, but aren't tables just charts of text....? The answer is no, but I was really looking for a reason to be able to post about this on a blog called works of chart.

## When would I use these?

The main situation that people tend to use the R version of stargazer is in reporting regression results in academic papers. It easily allows you to compare multiple regression results, and this lends itself to comparing results between models that have experimentally imposed effects and those that don't. this easily allows the user to view the differences in coefficients, statistical significance and the effects of the new variable introduced by the experiment. 

I'm hoping to update it over the next (*insert period of time here*) to support LaTeX and Markdown, but until them we have HTML for online reporting purposes. 

## How do I use it?

Check out the [github repo](https://github.com/mwburke/stargazer) or download using `pip install stargazer`, and please let me know if you have any feedback/feature requests!
