---
title: "Artificial-Artificial Intelligence.md"
date: 2023-06-30
issue: Issue 34

author: Andrew Leon Hudson
authors:
- Andrew Leon Hudson
showAuthorFooter: true
copyright: '© Andrew Leon Hudson 2023 All Rights Reserved'

description: "For about a year, the team at Mythaxis has been experimenting with sophisticated software tools in an attempt to understand – and maybe predict – what makes a story catch the editor's eye. So far we've discussed this in the context of the popular/unpopular theme of the day, Artificial Intelligence – but AI is a delicate subject when it comes to writing fiction. So let's take a look at exactly what we've been up to."

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

We aggregate data into three categories of story:

1. Acceptances (the stories we decided to publish)
2. Rejections (the stories we did not)
3. Better-rejections (ones which made our shortlist)

What we call "the Slushbot" is really just the statistical output of a number of software tools which look at all that data and try to identify patterns. We've been doing this for a year, and so far the results are not good. Even a couple of thousand stories is not a big data set. Worse, the texts in that data set vary in increadibly diverse ways: they range in length from 1,000 to over 7,000 words; they use different regional styles and spellings of English; and they represent wildly different subgenres under the general umbrella of "speculative fiction". It is hardly surprising that finding even remotely coherent patterns is not proving possible.

![Orbit-sml ><](images/Orbit.svg)

We've used a number of different software tools so far. Our original attempt used [SetFit](https://github.com/huggingface/setfit), a machine learning classifier, then we turned to [SEBERT](https://sbert.net/) to explore "embeddings": a mathematical representation of data, in our case linguistic data, such that each word, sentence, or paragraph can be compared against others to determine a degree of similarity or association. It is these associations that (we hoped, in vain) would allow distinctions to be identified between the categories we have chosen. 

We have also used [Orange Data Mining](https://orangedatamining.com/) and the research methodology of [distant reading](https://en.wikipedia.org/wiki/Distant_reading) (see also [here](https://www.digitalhumanities.org/dhq/vol/11/2/000317/000317.html) to explore and visualise a variety of linguistic patterns in the data. In all cases, we're careful to work with these tools at a local level, never sharing our data with organisations that could put it to uses outside of our control. 

Arguably our most encouraging find has been [LIWC-22](https://www.liwc.app/), linguistic analysis software used to help identify which narrative qualities Mythaxis "looks for" when accepting or rejecting a story submission. This involves focusing down on how different parts of language and language use (verbs, pronouns, punctuation, speech acts, narrative tone, cognitive tension, story tropes, categories and topics, etc) feature in a text. 

One thing which many of these tools have in common is, at least to my unskilled eye, *incomprehensibility*. The following image gives you a very general sense of what working with them looks like, and I'm glad that side of the magazine is safely in the hands of my collaborator, Marty Steer:

![](images/analysis-collage.png)

LIWC stands out for the relative accessibility of its information output, producing simple graphs suitable for an [editor-level degree of interpretation](https://mythaxis.co.uk/issue-33/editorial.html):

![](images/Accepted-vs-rejected.png)

Whether that interpretation is correct or not is another matter entirely! Currently we're not yet past the number crunching phase, perhaps we never will be, but the following is an idealised workflow for our future submissions: 

> Whenever the window opens and new stories arrive, our tool would analyse each one, compare its statistical data with the patterns that it has learned represent *acceptances* and *rejections*, and make a prediction about which category each story falls into. At the end of the window, we compare all its choices with mine and categorise the stories according to whether they were in fact accepted or rejected, increasing the body of data against which its future predictions will be made.

In the event that the tool's predictions increasingly reflect my actual decisions, it could become a valuable resource. We're a small operation and I always read all submissions, but the tool could order the slushpile according to predicted acceptance rating, or simply highlight strong candidates for the editor's attention. Either of these might prove beneficial; and the novelty of sitting back and letting the slushbot select all the stories for an issue would be an interesting experience, even if it wasn't one we repeated.

![Orbit-sml ><](images/Orbit.svg)

With all that said, we still have at least the shadow of an elephant in the room, I think.

There is an admitted similarity between how LLMs are trained and the way we study the story submissions we receive, and authors submitting their work to us for consideration might worry about that fact. This is understandable, so I want to reassure them on this point. Yes, true, in both cases texts undergo statistical analyses: the tools examine their sources of "data" in detail, looking for patterns upon which to perform their functions. The critical difference lies in what the ultimate objectives of those functions are.

LLMs and other generative tools use the statistical data they amass to generate new outputs of a similar kind. If you train them on works of fiction, they become fiction *simulators*: machines that make texts with similar charcteristics to "a story". I choose my words carefully here: not to get into the semantics of it, nor to casually abuse the philosophy of essentialism, but I don't think they make actual *stories at all*. Just something... very story-*like*.

By contrast, the tools we work with only output statistics. If you feed them stories, they don't become capable of making story-like texts. They just give us a new way to look at what is actually there. And, as an editor, what I always want to know is whether *what is there* is a story I will like, or a story I won't.

We'll probably never succeed in making a tool that can tell me that. But it would be very, very cool if we did.

![Orbit-lrg](images/Orbit.svg)
