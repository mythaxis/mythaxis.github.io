---
title: "Artificial-Artificial Intelligence.md"
date: 2023-06-30
issue: Issue 34

author: Andrew Leon Hudson
authors:
- Andrew Leon Hudson
showAuthorFooter: true
copyright: '© Andrew Leon Hudson 2023 All Rights Reserved'

description: "XXX."

image: images/A-AI_10x6.jpg
imageCopyright: "The image is adapted from [Robot in Love](https://depositphotos.com/368748152/stock-photo-man-standing-mysterious-library-digital.html) by Hector 'The Noise' Fernández."

type: stock
slug: artificial-artificial-intelligence.md
weight: 9
---

{{<glyph>}}O{{</glyph>}}ver roughly the last twelve months, the ***Mythaxis*** team has been conducting a generally light-hearted experiment in applying AI technology to short fiction publishing. We've been using the cutting edge tools of the day to create an artificial intelligence so familiar with the tastes of the editor that we can task it with reading story submissions on his (that is, *my*) behalf. One day, when it's proved itself to our satisfaction, we fully intend to hand over the reins to the "Slushbot" entirely (though probably just the once) and let it choose the stories that go into an issue of ***Mythaxis***.

Or at least, that's how we've framed it.

We talk about our experiment as if one day it's going to wake up like the AI Pinocchio of online magazine publishing. But that's never going to happen. We're not training an artificial intelligence at all. An *artificial*-artificial intelligence is closer to the truth. In fact, what we've been doing is considerably more mundane, though no less interesting from our perspective. So, while you can also read the glamorised version of the story in our recent editorials (issues [31](https://mythaxis.co.uk/issue-31/editorial.html), [32](https://mythaxis.co.uk/issue-32/editorial.html), and [33](https://mythaxis.co.uk/issue-32/editorial.html)), I'd like to take a moment to discuss exactly what we have, and have not, been doing over the last year.

![Orbit-sml ><](images/Orbit.svg)

I'll start with a negative. The world has become both enraptured and/or outraged by the arrival of Large Language Model (LLM) "artificial intelligence" text generators – *ChatGPT* being the most famous – and the visually stunning output of "generative" image systems, such as *Midjourney*.

These are not the tools that we are using, and for several good reasons.

First and foremost, at the current point in the development of such systems there are ethical question marks hanging over them which we find concerning. Generative systems need to be trained on vast quantities of material (millions or billions of images; countless lines of text), and there is at least the possibility that some of that material has been used without permission. The implications of this are far-reaching, not least the question of who can legally be considered the "author" of a work that is created by a so-called AI. Is it the software developers who coded the tool? Is it, even, the tool itself? Or *is* it the person who entered a prompt and received what they asked for? Regardless of any of those questions, we should also ask what rights are owed to those whose work the tools were trained upon, with or without their permission.

Until satisfactory answers can be given, these tools are problematic. Therefore, though we have experimented with image-generating AI tools in our less well informed past, we shall not do so again in future. For similar reasons, we don't invite submissions of AI-generated stories for publication, because it is far from clear who the true author of any such text would be.

The second reason we don't use generative tools is much simpler: our objective isn't to *create* anything, at least not in the sense of *writing a story* or *painting a digital picture*. We want to make a tool, not a product, and it's a tool with only one application: *predicting what kind of stories the editor of **Mythaxis** likes to publish*.

Let's look at how we're doing that.

![Orbit-sml ><](images/Orbit.svg)

Fundamentally, what we are doing is the rollercoaster thrill-ride that is *data analytics*. We're dipping into the toolkit of academics working in fields such as "Digital Humanities", "Distant Reading", "Data science", and (a label now maybe more familiar to the general reader thanks to events of the last few years) "Machine learning".

So far, I have published exactly 99 stories as editor of Mythaxis. I have rejected approxiamately 20 times more than that in total. This represents the body of data we want to know more about. To do so, the stories are anonymised, analysed individually, and the resulting data is aggregated. And then we analyse *that*.

We aggregate the data into three categories of story:

1. Acceptances (the stories we decided to publish)
2. Rejections (the stories we did not)
3. Better-rejections (ones which made our shortlist)

What we call "the Slushbot" is really just the statistical output of a number of software tools which look at all that data and try to identify patterns. We've been doing this for a year, and so far the results are not good. Even a couple of thousand stories is not a big data set. Worse, the texts in that data set vary in increadibly diverse ways: they range in length from 1,000 to over 7,000 words; they use different regional styles and spellings of English; and they represent wildly different subgenres under the general umbrella of "speculative fiction". It is hardly surprising that finding even remotely coherent patterns is not proving possible.

![Orbit-sml ><](images/Orbit.svg)

xxx DIFFERENT TYPES OF TOOL

![Orbit-sml ><](images/Orbit.svg)

We still have at least the shadow of an elephant in the room, I think.

There is an admitted similarity between how LLMs are trained and the way we study the story submissions we receive, and authors submitting their work to us for consideration might worry about that fact. Yes, true, in both cases the texts undergo statistical analyses: the tools examine their sources of "data" in detail, looking for patterns upon which to perform their functions. The critical difference lies in what the ultimate objectives of those functions are.

LLM generative tools use the statistical data they amass to generate new outputs of a similar kind. If you train them on stories, they become story *simulators*: machines that make new texts with similar charcteristics. I choose my words carefully here: not to get into the semantics of it, but I don't think they make actual stories at all. Just something... very story-*like*.

By contrast, the tools we use only output the statistics. If you feed them stories, they don't become capable of inventing new story-like texts. They just give us a new way to look at what is actually there. And we want to know whether *what is there* is a story I will like, or a story I won't.

Currently we're not yet past the number crunching phase, but in theory here is what we want to do: 

Whenever ***Mythaxis*** opens for submissions and new stories arrive, our tool would analyse each one, compare its statistical data with the patterns that it has learned represent *acceptances* and *rejections*, and make a prediction about which category it falls into. At the end of the window we compare all its choices with mine, and on the day those results are a perfect match I hang up my boots and retire, safe in the knowledge that my work here is done.

We'll never succeed in making a tool that can do that. But it would be very, very cool if we did.

![Orbit-lrg](images/Orbit.svg)
