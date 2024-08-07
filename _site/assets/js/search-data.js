var store = [{
        "title": "Why Make A Blog",
        "excerpt":"Does the world need another blog? Short answer, no. There are enough smart, experienced people out there writing blogs about data science and the next greatest thing, and we all know there are more than enough opinions on the internet. Then why make this blog? This blog is mostly for...","categories": [],
        "tags": ["jekyll"],
        "url": "http://localhost:4000/2017/12/23/why-make-a-blog.html"
      },{
        "title": "Slopegraph vs Barchart",
        "excerpt":"Slopegraphs are great …sometimes A slopegraph is a relatively underused chart with two sets of values on the left and right hand side, connected by lines. I know this sounds like a line chart with two values… and it kind of is… but trust me it has its uses. Slopegraphs...","categories": ["Data Visualization"],
        "tags": ["d3","javascript"],
        "url": "http://localhost:4000/data%20visualization/2017/12/28/slopegraph-vs-barchart.html"
      },{
        "title": "Population Stability Index",
        "excerpt":"What is the population stability index (PSI)? PSI is a measure of how much a population has shifted over time or between two different samples of a population in a single number. It does this by bucketing the two distributions and comparing the percents of items in each of the...","categories": ["Data Science"],
        "tags": ["python","ml","metrics"],
        "url": "http://localhost:4000/data%20science/2018/04/29/population-stability-index.html"
      },{
        "title": "Stargazer Python Library",
        "excerpt":"Introducing the Stargazer Python Package: I really like the stargazer package in R. It’s a fantastic library for creating beautiful, publication worthy regression tables, and I was bummed when they didn’t have a version in Python which is what I’m primarily working in these days. So.. naturally I created my...","categories": ["Data Science"],
        "tags": ["python"],
        "url": "http://localhost:4000/data%20science/2018/06/24/stargazer-regression-reporting.html"
      },{
        "title": "My Intro to Generative Art",
        "excerpt":"What is generative art? Generative art is procedurally generated art for those of us who are less traditionally artistically inclined. More specifically, those who have no skill but still have enough appreciation for art and mathematical principles to automate the creation of things that look snice. Javascript Libraries The go-to...","categories": ["Generative Art"],
        "tags": ["javascript","p5js"],
        "url": "http://localhost:4000/generative%20art/2018/07/09/generative-art-p5js.html"
      },{
        "title": "Probability Calibration",
        "excerpt":"Predictions As Confidence As you may already know, classification problems in machine learning commonly (though not always) use algorithms that output a predicted probability value that can be used to gauge confidence in how sure your model is that the input belongs to one particular class. Setting Probability Thresholds In...","categories": ["Data Science"],
        "tags": ["probability","ml"],
        "url": "http://localhost:4000/data%20science/2018/11/26/probability-calibration.html"
      },{
        "title": "Introduction to Idyll",
        "excerpt":"Over Thanksgiving, some friends of mine set out to find the best pumpkin pie recipe and in the process, baked 5 different pies for comparison. After enjoying and ranking them, they decided to open the survey population to let others determine what the truly best pie was with a blind...","categories": ["Data Visualization"],
        "tags": ["d3"],
        "url": "http://localhost:4000/data%20visualization/2018/12/04/idyll-pumpkin-taste-test.html"
      },{
        "title": "Basic Geometric Tiling",
        "excerpt":"Geometric Tiling I went on vacation to Italy recently, and while I was there, I fell in love with the mosaic tilings in the Cathedral of Santa Maria del Fiore and Baptistery of St. John in Florence. In general, I’m a huge fan of geometric design, but the designs reallly...","categories": ["Generative Art"],
        "tags": ["p5js"],
        "url": "http://localhost:4000/generative%20art/2019/06/18/basic-tiling.html"
      },{
        "title": "Multi-Armed Bandits Exploration",
        "excerpt":"Multi-Armed Bandit Overview A multi-armed what?? If you don’t know what the multi-armed bandit problem is, then you may be confused. I’m assuming that you have some background on this for the rest of the post, but if you don’t, here’s a quick rundown: Pretend you are a someone who’s...","categories": ["Data Science"],
        "tags": ["python","ml","probability"],
        "url": "http://localhost:4000/data%20science/2019/06/18/bandits-exploration.html"
      },{
        "title": "Codenames Clue Generator using Semantic Similarity",
        "excerpt":"In this post, I’ll talk about how I built a clue generator for the game Codenames that provides a list of potential clues, numbers and associated target words, all with Tensorflow. My day job is mostly internally facing and so I took this on as a way to practice building...","categories": ["Data Science"],
        "tags": ["python","ml","tensorflow"],
        "url": "http://localhost:4000/data%20science/2021/12/12/codenames-clue-generator-version-1.html"
      },{
        "title": "Spaghetti Code",
        "excerpt":"As I mentioned in an earlier post about tiling patterns, I really like truchet tilings. Each border of the tiles that traditionally have patterns that connect the midpoints of adjacent sides. I explored this concept a long time ago, but instead of using a traditional square grid, I used a...","categories": ["Generative Art"],
        "tags": ["javascript","p5js"],
        "url": "http://localhost:4000/generative%20art/2022/02/23/making-spaghetti-code.html"
      },{
        "title": "MMM: Miracle of Marketing Measurement or Misleading  Modeling Methodology?",
        "excerpt":"MMM: Miracle of Marketing Measurement or Misleading Modeling Methodology? TL;DR MMMs are a future-proofed tool for measuring marketing effectiveness in a world of increased online privacy, but can be prone to multiple silent failure methods that provide inaccurate results. What is an MMM? Media mix modeling is a statistical technique...","categories": ["Data Science"],
        "tags": ["ml","marketing"],
        "url": "http://localhost:4000/data%20science/2023/01/31/mmm-future-or-liability.html"
      },{
        "title": "PyMC Wrapper",
        "excerpt":"Overview Bayesian modeling can be super valuable for capturing uncertainty and leveraging the use of prior distributions for new products/geos/etc. I’m relatively new to the space, but in my role of machine learning engineer, I found the tools to be very focused on the science and less so on deployment....","categories": ["Data Science"],
        "tags": ["ml","python","bayesian"],
        "url": "http://localhost:4000/data%20science/2023/02/23/pymc-wrapper.html"
      },{
        "title": "Distribution Drift Tolerance",
        "excerpt":"Does PSI Have Reliable Thresholds? I’ve written before about the use of PSI (population stability index) to measure population drift and provided some guidelines on interpretation of scores taken from this resource. I recently began a project involving model monitoring and began to question how the authors of that paper...","categories": ["Data Science"],
        "tags": ["python","ml","metrics"],
        "url": "http://localhost:4000/data%20science/2023/09/28/distribution-drift-tolerance.html"
      },{
        "title": "ML Model Monitoring Metrics",
        "excerpt":"ML Model Monitoring Metrics: A Hierarchical Approach to Mitigating Silent Failures In the ever-evolving landscape of machine learning, maintaining a fleet of hundreds to thousands of production models can be a daunting task. These models are susceptible to a wide array of silent errors that can go undetected for extended...","categories": ["Data Science"],
        "tags": ["python","ml","metrics"],
        "url": "http://localhost:4000/data%20science/2024/07/28/model-monitoring-metrics.html"
      }]
