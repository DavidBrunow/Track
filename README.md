# Track
## Overview

Track is a very simple solution to my problems with tracking time. I came up
with this idea while writing [this blog post](http://brunow.org/2014/12/09/how-i-track-time/).

The application has a similar interface to chat software. You put your message
at the bottom of the pane on the left and it stores the timestamp of that
message. That message could be anything and the application will total up how
many hours were spent on that item throughout the day. If you stop working you
can put in a "-" as the message.

My purpose in developing this is to create a way for me to track my time with as
little mental and time overhead as possible. Track would not be very good for
large teams because the beauty of it is that it does not force users to input
their time information in any particular way. I think it is great for
individuals and small, closely knit teams.

## Using Track

Track lives in your browser and at this time does not need to connect to a
server. It uses HTML5 localStorage to store all your time information and that
information will be saved between browser sessions and even computer restarts.

To get started with Track, either clone the repository into a folder or download
a ZIP of all the files and then open default.html in your modern browser of
choice.

Please note that while I use this application to track my time I do not
recommend using it without extreme caution. I have not tested many situations or
any other browsers than Chrome.

## Planned Additional Features

* Use a delimiter to describe multiple similar items, such as "Project - Task"
  or perhaps "Client - Project - Task"
* Allow for customizable settings for the "end time" message (currently "-")
* Allow for customizable settings for rounding hours (currently rounds to the 
  nearest half hour)
* Allow for different time formatting
* Provide statistics in addition to the total amount tracked over the last 7
  days