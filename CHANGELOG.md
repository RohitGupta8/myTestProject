# Changelog

> **Tags:**
> * :boom:       [Breaking Change]
> * :rocket:     [New Feature]
> * :bug:        [Bug Fix]
> * :memo:       [Documentation]
> * :house:      [Internal]
> * :nail_care:  [Polish]

## v1.6.2 (2023-04-13)
#### :bug: Bug Fix
* Formated text is not pasted as un-formated in Writer

## v1.6.1 (2023-03-29)
#### :bug: Bug Fix
* Unable to copy, cut and paste in imagecaption of multiple plugins.

## v1.4.0 (2022-08-23)

#### :rocket: New Feature

* Add support for array of classes as parameter to `VirtualElement.addClass` function
* Add `data-dropzone=true` attribute to dropzone elements
* Enabled container selection to list conversion
* General list handling improvements
* Improved copy/paste handling
* Change drophandler execution to only run once with all files instead of one for each file

#### :bug: Bug Fix

* Fix for Google Chrome v96 drag and drop changes
* Fixed translatable labels for annotation tool mode

## v1.3.0 (2022-02-15)

#### :rocket: New Feature

* Add support for array of classes as parameter to `VirtualElement.addClass` function
* Add `data-dropzone=true` attribute to dropzone elements
* Enabled container selection to list conversion
* General list handling improvements
* Improved copy/paste handling
* Change drophandler execution to only run once with all files instead of one for each file

#### :bug: Bug Fix

* Fix for Google Chrome v96 drag and drop changes
* Fixed translatable labels for annotation tool mode

## v1.2.0 (2021-06-03)

#### :rocket: New Feature

* Added support for `Node._disableCopy`-property, which prevents nodes from being copy/cut and pasted in Editor areas

#### :bug: Bug Fix

* Fixed selection not selecting a newly created block node
* Always preserve annotations when copy/cut and pasting text

## v1.1.0 (2021-03-17)

#### :bug: Bug Fix

* Fixed issue where extra whitespace sometimes appeared when using annotations

#### :nail_care: Polish

* Changed behavior when drag and dropping/cut and pasting Nodes, no longer leaves empty paragraphs behind

## v1.0.0 (2021-02-25)

#### :house: Internal

* Initial release after being adopted by Naviga's writer team
