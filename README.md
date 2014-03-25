#VPR Topic Pages

We use this template to generate pages like this:
[Health Care Home](http://www.vpr.net/apps/health)

##How They Work

At VPR, we tweak a few lines in `apps/views.py` and spin up a topic landing page for any NPR API tag.

Other NPR member stations would need to change a bit more, primarily the styling and templates but also a few lines in `app.query.py`. If there is interest, I might further abstract things so that the station could be changed just as easily as the API tags.

## Author
[Matt Parrilla](http://twitter.com/mattparrilla)

##Copyright and License

Copyright 2013 Vermont Public Radio

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this work except in compliance with the License.
You may obtain a copy of the License in the LICENSE file, or at:

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language
governing permissions under the License.
