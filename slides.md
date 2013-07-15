---
#Pragmatic Javascript
- https://github.com/cjdelisle/pragmatic-javascript/

<center> ![trash](/img/trash.jpg) </center>

--

---
#This talk is about building a toolchain

--
- We need Quality software

--
- We need a Coherent Development Process

--
- We need Linting and Codestyle Enforcement

--
- Compilation and Verification

--
- Linking and Modularity (and dependency injection)

--
- And we need Unit Testing

--


---
#Javascript Myths

--


---
#Dynamically typed languages are toys

--
- Plenty of major web projects have been done in Perl, Python and Ruby

--
- Erlang is a dynamically typed language

--


---
#Varient #2: Any serious project in Javascript must use GWT

--
- GWT is a toolchain, serious projects need toolchains

--
- Gmail? Google Maps? Google Docs?

--
- GWT apps are not able to take advantage of many native Javascript tools

--
- Static typing in Java protects you from some classes of bugs

--
- Abstraction makes many classes of bugs difficult to debug

--

![slow](/img/WaitCursor-300p.gif)

- GWT build time is slow

--
- GWT apps have a few second startup time

--
- This is probably why Google has relegated GWT to the backwater projects like blogger and groups

--


---
#Javascript Is Not Object-Orientated

--
- Javascript is a wholy unique OOP model called Prototypal

--
- Douglas Crockford gives a great lecture about the Prototypal model, you should watch
http://www.youtube.com/watch?v=DwYPG6vreJg

--
- Prototypal OOP is more powerful than Classical OOP (Java), you choose a model

--
- Classical OOP, functional, imperative

--
- Each paradigm excels in a different context

--


---
#Javascript Lacks Tools

--
- This one is sort of true

--
- Becoming less true every day

--
- But the best tools are spread out

--
- Still not many complete toolchains exist in the wild

--


---
#Javascript Facts

--


---
#Javascript Is Not Strict

--
- Languages like Java, Python and Go will fail with errors

--
- Javascript, PHP and Perl will attempt to guess what you meant to do

--
- These assumptions are well standardized

--
- Sometimes these assumptions prevent bugs, eg: NPE

--
- Where the language has to make an assumption there might be a bug

--


---
#Totally invalid code will only be discovered when executed

--
- Some bugs are universal. `String s = null; s.toString();`

--
- Some bugs are caught by static typing

--
- If a variable doesn't exist the browser assumes it will exist later

--
- Typos

--
- Passing arguments in the wrong order

--
- Refactoring can be painful

--


---
#Javascript is not modular

--
- One global namespace

--
- Nobody wants to constantly type jQuery so $ aliases jQuery.

--
- $ also aliases Prototype.

--
- Javascript files must be executed one at a time.

--


---
#The Tools

--


---
#No IDE integrated tools

--
- IDEs are bad for Open Source

--
- An IDE is like a radiation suit

--
- Makes you tolerate a much higher level of pain than you would otherwise

--
- Takes a long time to get the config parameters right

--
- In Open Source, developers come and go, perhaps only write one patch

--
- Developer discovers project, tries to write patch, unable to build

--
- Takes too long to configure an IDE for one patch

--
- Developer runs off screaming because build system is nightmare

--
- Core devs don't know there's a problem because radiation suits are comfortable

--
- "Wonder what got into that guy?" they ask

--
- For Open Source to work, build tools must have low bar of entry

--
- This presentation will be based on integration of tools with Maven

--


---
#Without further Ado...

--


---
#Introducing Closure Compiler

--
- The most advanced minification/validation tool available

--
- Built on top of Rhino, actually runs the code looking for bugs

--
- Annotations allow static typing... when you want it

--
- Constant folding to improve performance

--
- Dead code elimination - exported symbols must be annotated!

--
- Used on major projects such as Gmail, Google Docs, video.js

--


---
#Using Closure Compiler

--
- Play and get a feel for it: http://closure-compiler.appspot.com/

--
- wget http://closure-compiler.googlecode.com/files/compiler-latest.zip

--
- `java -jar compiler.jar --help` <-- looks like the GCC man page!

--


---
#Annotations

--
- @param Just like javadoc but it takes a type `@param {Number} myint`

--
- @return Same idea

--
- @define constants in your script, override with -D compiler flag

--
- @expose prevents a symbol from being renamed or removed as dead code

--
- Many more annotations available

--
- https://developers.google.com/closure/compiler/docs/js-for-compiler

--
- Lots of them lifted directly from Java keywords

--
- Use Caution

--


---
#But Slow!
--

![slow](/img/compiling.png)

--

- 4 second startup cost (compiling a trivial hello world example)

--
- 1.5k LoC/sec + 4 second startup cost

--
- 4m53 seconds to compile xwiki-platform-web, 1m28 spent in Closure Compiler code

--
- What's really maddening is that uglifyjs in node runs in 25.3 seconds

--
- Uglifyjs startup time is neglegable

--



---
#Closure Compiler In Maven

--
- No official Maven plugin for running Closure

--
- Everybody Wrote Their Own

--
- Everybody Got It Wrong

--
- https://github.com/samaxes/minify-maven-plugin - doesn't run the all important quality checks

--
- https://github.com/gli/closure-compiler-maven-plugin/ - Same

--
- https://github.com/mdasberg/maven-closure-compiler-plugin - No way to fail the build

--
- https://github.com/jlgrock/ClosureJavascriptFramework - Forces you to use Google's js library

--
- https://code.google.com/p/closure-compiler-maven-plugin/ - Must specify input js files manually, smells

--


---
#Fork Time

--
- https://github.com/mdasberg/maven-closure-compiler-plugin Cleverly Built

--
- Plugin calls Closure with traditional command line options

--
- Works with most recent version of Closure

--
- Multiple compilations runs in the same JVM process by hooking the exit function

--
- All we have to do is allow arbitrary command line options to be passed from Maven

--


---
#Result

--
- https://github.com/cjdelisle/maven-closure-compiler-plugin

--
- https://github.com/cjdelisle/pragmatic-javascript/tree/master/examples/closure-compiler

--
- Build each one with maven

--
- Edit hello.js and add lines which violate annotated type constraints

--
- Fail the build

--


---
#Closure Compiler Limitations

--
- It compiles too slow

<img src="/img/la_compile_du_slow.jpg" style="width:40%"></img>

--

- Doesn't enforce code style checks, tab/space agnostic

--
- `var x = { renamed_field:"abc" };  if ("renamed_field" in x)`

--
- Designed for use with Google's toolchain

--


---
#Linting and codestyle enforcement

--
- Goal #1 find patterns which contain bugs so often that they should be eschewed

--
- Goal #2 promote maintainability by encouraging everybody to write similar looking code

--
- Goal #1 is huristic in nature, any pattern can contain bugs

--
- Goal #2 is a balance between project coherence and indvidual creativity

--
- If you embrase hazing, you'll have a team of "bros"

--


---
#Closure Linter

--
- Written in Python

--
- Makes sure your code is in compliance with Google's standards

--
- Fixes common codestyle errors automatically!

--
- Not very strict

--
- Does not look for bug prone code, just codestyle

--


---
#JsLint

--
- Written in js by Douglas Crockford

--
- Far more strict than Closure Linter

--
- Spots uses of undefined variables, configurable globals

--
- Shadowing/redefinition of variables

--
- Switch statement fallthrough

--
- `if (x = y)`

--
- Many many more awesome bug busting validation rules!

--


---
#JsLint The Bad Parts

--
- Regular expressions which match lots of things considered "insecure"

--
- `x++` and `x--` are not allowed

--
- Strict and poorly documented whitespace rules

--
- Lead to lots of false positives

--
- But you can disable them

---
#Only one var statement allowed at the beginning of the function

--
- You can't turn it off!

--
- `for (var i = 0; i < 10; i++)`       Illegal!

--
- `var b, f, i, j, p, seen = {}, t;`   Required!

--
- It doesn't really make any sense

![no sense](/img/sense_ironing.jpg)

---
#And it's really just downright bizarre

<img style="width:100%" src="/img/sense_horseCat.jpg"></img>

--

- Maybe he's just trolling everyone

---
#Other than that, what's the point?

<img style="width:100%" src="/img/why.jpg"></img>

---
#Anyway...

--
- Enter JsHint

--
- Anton Kovalyov and Paul Irish forked JsLint

--
- Allowed every check to be disabled

--
- According to github, JsHint has won (2,371/442 vs. 1,662/203)

--
- Get to know the parameters here: http://www.jshint.com/docs/

--
- https://github.com/cjdelisle/pragmatic-javascript/tree/master/examples/jshint

--
- JsHint parameters can be specified in the pom.xml file

--
- And overridden in comments the .js file

--


---
#Codestyle Fixing

--
- Golang has a very nice tool called gofmt

--
- The idea is it will format the whitespace for you

--
- Like an IDE but part of the build

--
- `uglifyjs messy-example.js -b --comments all` does the same

--
- To be investigated

--


---
#Linking and Modularity

--
- Javascript still has no module system

--
- Two and a half solutions to this problem

--
- CommonJS - Well specified, many implementations, designed for server side

--
- goog.require - Part of the google closure library, predated CommonJS

--
- AMD - Forked from CommonJS, designed for client, included in XWiki

--


---
#CommonJS

--
- Many implementations

--
- Right now it would be painful to use in the browser

--
- `var x = require('someModule');`

--
- Javascript doesn't do blocking very well.

--
- Can't use `<script>` tags, forced to use blocking AJAX calls and eval.

--
- Nobody does this

--
- Alternatively you compile all of your CommonJS files together.

--


---
#goog.require

--
- Syntax similar to CommonJS but slightly less elegant

--
- Part of closure library, a huge library most people have no idea exists

--
- If you want to write Google Docs, this is the library for you

--
- Allows a la carte loading through goog.module.ModuleManager

--
- Lacking outside community

--
- If you use this tool chain, it owns you

--
- http://docs.closure-library.googlecode.com/git/index.html

--


---
#AMD

--
- Basically an asynchronous fork of CommonJS

--
- Thriving community

--
- Require.js, Dojo, curl.js, Transporter, Teleport

--
- `define(['someModule'], function(x) { .... });`

--
- Uses `<script>` tags with async property set to true

--
- Possible to compile AMD modules into groups which are loaded seperately

--
- Possible to convert AMD module into self-contained library for publication

--
- May become standardized as part of CommonJS

--


---
#This is where things get difficult

--
- Closure Compiler works best with goog.require modules

--
- Can handle CommonJS modules

--
- There is experimental ability to translate AMD modules to CommonJS

--
- But Closure Compiler cannot output AMD modules with unsatisfied requirements

--
- No dynamic linking

--


---
#RequireJS to the Rescue?

--
- RequireJS can compile a group of modules together

--
- Can still have unsatisfied requirements which will be resolved at runtime

--
- And it works in Rhino/Java and there's a Maven plugin

--
- It even supports Closure Compiler

--
- But only as a minifier, no validation

--
- It runs Closure after concatinating files, error messages would be useless

--


---
#So lets try running Closure Compiler first

--
- Define some externals: `/** @param {...?} a */ function define(a){};`

--
- Run Closure on each .js file individually

--
- Then run Require.js over the output just to concatinate the files, resolving dependencies

--
- Success! https://github.com/cjdelisle/pragmatic-javascript/tree/master/examples/amd

--
- Outputs minified js which will load jquery and runs in any recent XWiki

--


---
#Still Buggy

--
- Namespace collisions in AMD

--
- We need to release js files in maven!

--


---
#Testing

--
- Comprehensive tests catch bugs

--
- Improves Quality

--
- Bulsters confidence in changes

--
- Fast tests shorten developer feedback loop, man-hours & machine-hours per LoC

--
- A selenium "walkthrough test" is nice, basically automated manual testing

--
- Developers can't afford to wait for selenium unit tests

--


---
#Introducing qUnit

--
- Developed for the jQuery project

--
- Bread and butter tests and assertions, nothing fancy

--
- Load up an HTML file in your browser

--
- All tests run while you watch, fast!

--
- But you still need a browser

--


---
#PhantomJS, headless WebKit browser

--
- It's a fully functional WebKit browser without any gui

--
- Scriptable

--
- Fast

--
- But platform dependent

--


---
#Running PhantomJS in Maven

--
- Check platform, download correct file, run

--
- Done for us: arquillian-phantom-driver

--
- But it's a selenium driver, we just need phantom

--
- Write a little maven plugin to grab out the binary and run it with our parameters

--
- Done: https://github.com/cjdelisle/phantomjs-maven

--


---
#Pulling it all together

--
- Closure Compiler to compile the files and find errors

--
- RequireJS to "link" the resulting compiled js files

--
- qUnit/PhantomJS to run the JS unit tests

--
- JSHint to check for bugs and codestyle violations

--
- https://github.com/cjdelisle/pragmatic-javascript/tree/master/examples/qunit

--


---
#Further research

--
- Placing JS files in Maven repositories

--
- Integrating the Maven dependency system with RequireJS

--


---
#Demos

--


---
#Questions
