# react-easy-refactor [BETA]

This extension simplifies the process of moving inline styles from React Native components to an external style object. Two commands are provided to facilitate this task: one to move the styles and another to rename the generated style keys.

Please note that this extension is currently in beta and may not be stable.

## Short Video

[![IMAGE ALT TEXT HERE](https://img.youtube.com/vi/G0ePC3ZdHoc/0.jpg)](https://www.youtube.com/watch?v=G0ePC3ZdHoc)

## Full Video

[![IMAGE ALT TEXT HERE](https://img.youtube.com/vi/kQUDu1DmvmE/0.jpg)](https://www.youtube.com/watch?v=kQUDu1DmvmE)

## Features

### Commands

1. **Move Styles to Constant**: Moves all static inline styles in the current file to a constant object. You can choose an existing object or create a new one by selecting "Custom". If "Custom" is selected, a new object will be created. Otherwise, the selected object will be used to store the styles.

2. **Rename Styles**: Renames all styles that were moved by this extension. Styles are generated with keys like `style_0`, `style_1`, etc. This command allows you to easily rename them.

## Limitations

1. Currently react workflow is not address involving css/scss files and class names. Hopefully future version will support them
2. It only moves static styles and rest are ignored.
    1. Style with logic is ignored: `{fontColor: isBig? 12:10}`
    2. Style with arrays are ignored: `[{...},{...}]`
    3. Style with dynamic values are ignored: `{fontColor:color, fontSize: size}`
3. If your file has text like `style_0` or `style_1` then it rename feature will not work as expected.

## Requirements

None

## Extension Settings

None

## Known Issues

This extension is currently in beta and may have some issues. If you encounter any problems, please feel free to email me at "<diggaamitoo7@gmail.com>" with a screenshot and code snippet so I can investigate and resolve the issue as quickly as possible.

## Release Notes

### 0.9.0

Beta release of react-easy-refactor extension.

Features
Two commands added:
Move all styles to constant: Allows you to move all static inline styles to an outer object.
Rename auto-generated styles: Allows you to easily rename all styles which are moved by this extension.

### 0.0.1

Beta Version for test purpose only. It does not have any feature.
