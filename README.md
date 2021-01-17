# Modeling UI with Statecharts

Presentation originally given on 09/24/2020.

This presentation was transcribed into a [blog
post](https://blog.grio.com/2020/10/modeling-user-interfaces-with-statecharts.html)!

## Overview

In this presentation, I explore one of the most pervasive types of bugs in
modern applications, impossible state bugs, and how statecharts can help us
model our UI in a way that prevents impossible states altogether. I introduce
what statecharts are and how to think in terms of them, then I walk through
rewriting a complicated user flow using XState, a library for state machines in
JavaScript.

### Resources

- [statecharts.github.io](https://statecharts.github.io/)
- [XState](https://xstate.js.org/docs/)
- [Redux is half of a pattern](https://dev.to/davidkpiano/redux-is-half-of-a-pattern-1-2-1hd7)
- [Vaguely reassuring state machines](https://twitter.com/happyautomata)

## Viewing the Presentation

This presentation is built with [mdx-deck](https://github.com/jxnblk/mdx-deck),
a library for building slideshows with [MDX](https://mdxjs.com/) (Markdown with
JSX/React).

You can download a static version of the slides as a PDF
[here](https://github.com/courier-new/statecharts-presentation/raw/master/deck.pdf).

To run and interact with the slides yourself, first clone the repo and install
the project dependencies with `yarn`:

```bash
$ git clone https://github.com/courier-new/statecharts-presentation.git
$ cd statecharts-presentation
$ yarn
```

Then run the slideshow:

```bash
$ yarn start
```

All of the slides are served from `deck.mdx`. To re-export an updated PDF, see
the [mdx-deck docs](https://github.com/jxnblk/mdx-deck/blob/master/docs/exporting.md#pdf).
