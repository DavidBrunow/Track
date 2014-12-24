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
little mental and time overhead as possible.

## Planned Additional Features

* Edit the description of an item
* Use a delimiter to describe multiple similar items, such as "Project - Task"
* Allow for customizable settings for the "end time" message (currently "-")
* Allow for customizable settings for rounding hours (currently rounds to the 
  nearest half hour)
* Allow for different time formatting
* Provide statistics in addition to the total amount tracked over the last 7
  days