import * as babel from '@babel/core';
import { ParseResult } from '@babel/parser';
import generator from '@babel/generator';
import { IAction, IAnalysis, IChange, IRefactor } from "./interfaces/IRefactor";
import { StyleDeclaration, canRefactorStyleAttribute, findAllProblematicStyles, getAllDeclaredKeyInObjectExpression, multipleAscendingNonOverLappingStylesName, multipleRandomNotOverLappingStylesName } from './refactor-utils';
import { ReactFile } from './ReactFile';

export class AllStyleExtractRefactor implements IRefactor {

	constructor(private name:string){}
	refactor(ast: ParseResult<babel.types.File>): IAction {
		let styles : StyleDeclaration  | undefined =  new ReactFile(ast)
			.getStyleDeclarationWithName(this.name);
		if (styles == undefined) {
			return { type: 'none' };
		}
		const declaredStyleExpressions = styles.objectDeclaration.node;
		const cloneDeclaredStyleExpressions = babel.types.cloneNode(declaredStyleExpressions);
		if (declaredStyleExpressions.loc?.start == undefined || declaredStyleExpressions.loc.end == undefined) {
			return { type: 'none' };
		}

		const styleAttribute = findAllProblematicStyles(ast)
			.filter(canRefactorStyleAttribute);

		if (styleAttribute.length == 0) {
			return { type: 'none' };
		}
		const allRandomNames = multipleAscendingNonOverLappingStylesName(
			styleAttribute.length,
			getAllDeclaredKeyInObjectExpression(styles.objectDeclaration.node)
		);

		const data = styleAttribute.map((styleAttribute, index) => {
			const randomNewName = allRandomNames[index];
			const cloneComponentStyleExpression = babel.types.cloneNode(styleAttribute.value.expression);
			return [randomNewName, cloneComponentStyleExpression] as const;
		});

		const appendStyle = babel.types.objectExpression(
			[
				...cloneDeclaredStyleExpressions.properties,
				...data.map(([randomNewName, cloneComponentStyleExpression]) => {
					return babel.types.objectProperty(
						babel.types.identifier(randomNewName),
						cloneComponentStyleExpression
					);
				})
			]
		);
		const jsxObjectConvertedToCode = generator(appendStyle).code;

		const replaces = data.map(([randomNewName, cloneComponentStyleExpression]) => {
			return {
				type: 'replace' as const,
				start: cloneComponentStyleExpression.loc!.start,
				end: cloneComponentStyleExpression.loc!.end,
				text: `${styles!.name.node.name}.${randomNewName}`
			};
		});

		const diagnostics: IAnalysis[] = replaces.map((replace) => {
			return {
				severity: 'info',
				range: {
					start: replace.start,
					end: replace.end,
				},
				message: `Extracted to ${replace.text}`
			};
		});

		return {
			name: 'Extract all style',
			type: 'required',
			changes: [
				{
					type: 'multiple',
					changes: replaces
				},
				{
					type: 'replace',
					start: declaredStyleExpressions.loc.start,
					end: declaredStyleExpressions.loc.end,
					text: jsxObjectConvertedToCode
				}
			],
			diagnostics: diagnostics,
		};
	}
}
