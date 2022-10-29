# commons-feedback

This repository contains two different but tigthly related applications:

- an *Android* mobile app, intended to collect student/attendee reactions to a synchronous lecture/event; its name, [*WE-COLLAB*](https://www.we-collab.eu), is that of the omonimous *Erasmus+* project (2022-2024) inside which it has been developed; 
- a server-side [*Django*](https://www.djangoproject.com/) application, *commons-feedback*, which extends the [*CommonSpaces*](https://github.com/gtoffoli/commons) collaborative learning platform to interface the mobile app and process its output.

## Objectives

The objectives and the initial design ideas of both the mobile app and the Django application were set out in the blog article [The design of a Student Feedback App](http://www.we-collab.eu/weblog/6/) (partially obsolete). Briefly, the main objectives pursued by *commons-feedback* are

- the growth of the *student engagement* and
- the improvement of the *lecture quality*, in synchronous events (remote or in presence).

## Functionality

Two kinds of student feedback are supported:
- sending a *verb*, which codes the student reaction: an alert or a request to the lecturer, chosen from a small set of options; the choice is done with a 3x3 virtual keyboard;
- sending a free *chat message*.

The lecturer, and or her assistant, gets an aggregated view of the students' feedback through an *Event Dashboard*, which puts together:
- a *raw log* of the students' *reaction messages*;
- a *Verb cloud*, which shows the nine available options with font sizes related to their relative frequencies;
- the *chat* pane, which includes an input box and the message list; that is, also the lecturer can write to the chat.

## Some context

Compared to [*Wooclap*](https://www.wooclap.com/), which is a fairly well-known commercial product for a comparable "market", *commons-feedback*
- is free and open source;
- allows to send nine reaction types, while Wooclap has only "I'm confused";
- doesn't offer polls and question/answer functionality; but our feeling is that these are functions not really liked by teachers, since they imply a a non-trivial lesson design activity;
- instead, it comes with a flexible chat facility, which can support similar engagement objectives.

While *commons-feedback* doesn't support statistical processing directly useful for educational managers, we think that it can be quite useful for *formative assessment*:
- all feedback is saved by the native tracking functions of*CommonSpaces*;
- most importantly, said feedback is forwarded to a *Learning Record Store* (*LRS*) as *xAPI statements*, for off-line processing.

Please, consider that:
- the *WE-COLLAB* project also includes original research and experimentation in the interpretation of neuro-physiological signals induced by learning situations, in terms of cognitive and emotional states;
- the availability of more explicit and more subjective reactions by the students, related to the same learning situations, should provide essential data for comparative  evaluation.

## Some technical aspects

The mobile (client-side) app has been entirely developed in *Javascript* for *Android* using the [*DroidScript*](https://droidscript.org/) on-device development environment.

The server-side web application has been developed as a *Django* app in *Python*, mostly as an extension of the *CommonSpaces* platform. The *frontend* uses also *Vue.js*.

The system architecture strongly relies on the [*WebSocket*](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API) protocol, which was necessary for
- the real-time update of the *Event Dashboard*;
- the implementation of the *chat* on both sides.

The first version of the server-side software was generated following the [*channels* tutorial](https://channels.readthedocs.io/en/stable/tutorial/index.html) referring to the design of a simple chat application.

As to the versions of the development and run-time environments and of many software libraries, please refer to the file *requirements.txt* of [*CommonSpaces*](https://github.com/gtoffoli/commons).
