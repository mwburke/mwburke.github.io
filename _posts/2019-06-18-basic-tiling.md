---
layout: post
title: 'Basic Geometric Tiling'
subtitle: 'Inspiration from Italian Mosaics'
date: 2019-06-18
author: Matthew
cover: /assets/img/italy_mosaic_2.png
tags: creative-coding p5js
---

## Geometric Tiling

I went on vacation to Italy recently, and while I was there, I fell in love with the mosaic tilings in the Cathedral of Santa Maria del Fiore and Baptistery of St. John in Florence. In general, I'm a huge fan of geometric design, but the designs reallly caught my eye, and I did my best to recreate some of them in processing with some nonstandard color palettes:

![](/assets/img/italy_mosaic_1.png)

![](/assets/img/italy_mosaic_2.png)

If these piqued your interest, I'd recommend checking out more [at my generative art site](https://mwburke.github.io/generative-art/posts/030.html), or much better, go visit Florence yourself and get inspired!

Of course, once I returned home and was talking about how beautiful the tiling was, I was informed about [Islamic geometric patterns](https://en.wikipedia.org/wiki/Islamic_geometric_patterns), which blew Italy out of the water in terms of complexity and creativity. I definitely will be reviewing my future travel plans in light of this discovery, and in the meantime, I hopefully can learn more about their theory and history to get a better appreciation of them.

## Organic Tiling: Truchet Patterns

While geometric patterns are always awesome, I had recently run into [this article](https://christophercarlson.com/portfolio/multi-scale-truchet-patterns/) talking about truchet patterns, and wanted to try something a little more rounded and actually generative to see if it had a more "organic" feel about it.

The idea behind them, is that they are square tiles with round internal paths/connections that can be connected to any other tile pattern. It didn't take long to create each one of them, but after just generating a random tileset, the results are rather unsatisfying:

![](/assets/img/truchet_pattern_4.png)

This is pretty much inline with what I have been viewing and reading from well-known generative artists, and so I took a stab at creating a little more structure into the process by nesting squares of patterns within each other and was quite pleased:

![](/assets/img/truchet_pattern_1.png)

![](/assets/img/truchet_pattern_3.png)

I took it a step further, and while still limiting the available tiles and placing them diagonally, I allowed the rotation vary. These might be some of my favorite results in that they're not so random as to be without structure, but it seems more natural:

![](/assets/img/truchet_pattern_2.png)

There's definitely more work I could do with utilizing the smaller subtiling and larger amount of tiles, but I'll put that ahead for future work. If you're interested in seeing more of these patterns, you can [do so here](https://mwburke.github.io/generative-art/posts/032.html) and create as many as you want!

I hope to do some more work on hexagonal tiling with connections based on node-based growth algorithms, which I think have a lot of potential for walking the line between structure and chaos.

### Resources:

* [Multi-Sscale Truchet Patterns - Christopher Carlson](https://christophercarlson.com/portfolio/multi-scale-truchet-patterns/)
