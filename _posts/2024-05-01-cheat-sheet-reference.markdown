---
layout: post
title:  "Cheat Sheet Reference"
date:   2024-05-01 14:15:00 -0700
categories: jekyll update
---

## PHP

TODO

## Python

- argparse: [https://gist.github.com/dmertl/0bf17e84ea009e6e12f587d152d4ed62]()
- pyenv: [https://gist.github.com/dmertl/53b54521e4ded6e1e2626869c1bb5f34]

## Javascript

TODO

## Linux / Bash

- [https://gist.github.com/dmertl/b21937aa625adcfdde6377e047b289e5][]

## Unicode

- Identify unicode characters: https://www.babelstone.co.uk/Unicode/whatisit.html
- JS to print all unicode characters from current names list: https://gist.github.com/dmertl/257433864ba85d4fcc3c128a47db34c3

TODO: Gist of "fun" characters. Make easy to copy + paste to check if they are supported.

## Logstash

- Test grok patterns: https://grokconstructor.appspot.com/do/match
- Builtin grok patterns: https://github.com/hpcugent/logstash-patterns/blob/master/files/grok-patterns.json

TODO: Write a gist cheatsheet with below items. Multiline handling.

Assigning a type:

```
%{NUMBER:[csv_export][rows]:int}
```

Using custom regex and assigning to variable:

```
(?<log_level>([Dd]ebug|[Ii]nfo|[Nn]otice|[Ww]arning|[Ee]rror|[Cc]ritical|[Aa]lert|[Ee]mergency|[Dd]eprecated)):
```

## OS X

- https://gist.github.com/dmertl/60bf74233fdf87b4535ab16cf6a59ab7

## Misc

- Script for parsing ElasticSearch results: https://gist.github.com/dmertl/16a1ec1eb88fc3a7bad5ebdbc71b7c45
