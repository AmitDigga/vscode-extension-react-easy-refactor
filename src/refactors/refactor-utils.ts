

import * as babel from '@babel/core';
import { ParseResult } from '@babel/parser';
import * as t from '@babel/types';
import { P, isCallExpressionPath, isIdentifierPath, isMemberExpressionPath, isObjectExpressionPath } from './path-utils';


export type StyleDeclaration = {
	name: P<t.Identifier>,
	objectDeclaration: P<t.ObjectExpression>,
};
// export function getProgramStyleReactStyleDeclaration(ast: ParseResult<t.File>):{ 
// 	name: t.Identifier,
// 	expression: t.ObjectExpression,
// } | undefined {
// 	const target = ast.program.body
// 	let objectExpression: undefined | t.ObjectExpression = undefined;
// 	let nameIdentifier: undefined | t.Identifier = undefined;
// 	target.forEach(node => {
// 		if (t.isVariableDeclaration(node)) {
// 			const declaration = node.[0];
// 			if (t.isVariableDeclarator(declaration)) {
// 				let data = isInitDirectStylesDeclarationPath(declaration);
// 				if (data !== false) {
// 					objectExpression = data.objectExpression.node;
// 					nameIdentifier = data.name.node;
// 					return;
// 				} else {
// 					const data = isInitStylesheetCreateDeclarationPath(declaration);
// 					if (data !== false) {
// 						objectExpression = data.objectExpression.node;
// 						nameIdentifier = data.name.node;
// 						return;
// 					}
// 				}
// 			}
// 		}
// 	});
// 	return {
// 		name: nameIdentifierTraversed,
// 		expression: objectExpressionTraversed
// 	};
// }


export const isInitDirectStylesDeclarationPath = (path: P<t.VariableDeclarator>): false |
{
	type: "style-direct",
	name: P<t.Identifier>,
	objectExpression: P<t.ObjectExpression>,
} => {
	const id = path.get('id');
	const init = path.get('init');
	if (!isIdentifierPath(id)) {
		return false;
	}
	if (!isObjectExpressionPath(init)) {
		return false;
	}
	// const variableName = id.node.name.toLowerCase();
	// if (!variableName.match(/style/)) {
	// 	return false;
	// }
	return {
		type: "style-direct",
		name: id,
		objectExpression: init,
	};
};

export const isInitStylesheetCreateDeclarationPath = (path: P<t.VariableDeclarator>): false | {
	type: "style-stylesheet-create",
	name: P<t.Identifier>,
	call: P<t.CallExpression>,
	objectExpression: P<t.ObjectExpression>,
} => {
	const id = path.get('id');
	const init = path.get('init');
	if (!isIdentifierPath(id)) {
		return false;
	}
	if (!isCallExpressionPath(init)) {
		return false;
	}
	const callee = init.get('callee');
	if (!isMemberExpressionPath(callee)) {
		return false;
	}
	const object = callee.get('object');
	const property = callee.get('property');
	if (!isIdentifierPath(object)) {
		return false;
	}
	if (!isIdentifierPath(property)) {
		return false;
	}
	if (object.node.name !== 'StyleSheet') {
		return false;
	}
	if (property.node.name !== 'create') {
		return false;
	}
	if (init.node.arguments.length !== 1) {
		return false;
	}
	const arg = init.get('arguments')[0];
	if (!isObjectExpressionPath(arg)) {
		return false;
	}
	return {
		type: "style-stylesheet-create",
		name: id,
		call: init,
		objectExpression: arg,
	};
};


export type StyleObjectAttribute = t.JSXAttribute & {
	value: t.JSXExpressionContainer & {
		expression: t.ObjectExpression,
	},
	name: t.JSXIdentifier & {
		name: 'style',
	},
};


export function findAllProblematicStyles(ast: ParseResult<t.File>): StyleObjectAttribute[] {
	const nodes: StyleObjectAttribute[] = [];
	babel.traverse(ast, {
		JSXAttribute(path) {
			if(!isStyleObjectAttribute(path)) {
				return;
			}
			if (!isObjectExpressionConstantOnly(path.node.value.expression)) {
				return;
			}
			nodes.push(path.node);
			path.skip();
		}
	});
	return nodes;
}

export function isStyleObjectAttribute(path: P<t.Node> ): path is P<StyleObjectAttribute> {
	if(!path.isJSXAttribute()) {
		return false;
	}
	const name = path.get('name');
	const value = path.get('value');
	if(!name.isJSXIdentifier({name: 'style'})) {
		return false;
	}
	if(!value.isJSXExpressionContainer()) {
		return false;
	}
	const expression = value.get('expression');
	if(!expression.isObjectExpression()) {
		return false;
	}
	return true;
}

export const randomNumberUpTo1000 = () => Math.floor(Math.random() * 1000);
export const multipleRandomNotOverLappingStylesName = (count: number, avoidNames: string[]) => {
	const names = new Set<string>();
	while (names.size < count) {
		const name = randomStyleName();
		if (!avoidNames.includes(name)) {
			names.add(name);
		}
	}
	return Array.from(names);
};
export const multipleAscendingNonOverLappingStylesName = (count: number, avoidNames: string[]) => {
	const names = new Set<string>();
	let done = 0;
	while (names.size < count) {
		const name = ascendingStyleName(done++);
		if (!avoidNames.includes(name)) {
			names.add(name);
		}
	}
	return Array.from(names);
};
export const randomStyleName = () => `style_${randomNumberUpTo1000()}`;
export const ascendingStyleName = (suffix:number) => `style_${suffix}`;

export const isObjectExpressionConstantOnly = (expression: t.ObjectExpression) => {
	if (isObjectExpressionMadeOfObjectPropertyOnly(expression)) {
		return arePropertiesConstantOnly(expression.properties);
	}
	return false;
};

function isObjectExpressionMadeOfObjectPropertyOnly  (expression: t.ObjectExpression) : expression is t.ObjectExpression & { properties: t.ObjectProperty[] }{
	return expression.properties.every(property => t.isObjectProperty(property));
};

// function isPropertyConstantOnly(property: t.ObjectProperty): property is t.ObjectProperty & { key: t.Identifier, value: t.Literal | t.Identifier }{
// 	if (!t.isIdentifier(property.key)) {
// 		return false;
// 	}
// 	const value = property.value;
// 	if (!t.isLiteral(value) && !t.isIdentifier(value)) {
// 		return false;
// 	}
// 	return true;
// };

const arePropertiesConstantOnly = (properties: t.ObjectProperty[]) => {
	for (const property of properties) {
		if (!t.isIdentifier(property.key) && !t.isLiteral(property.key) ) {
			return false;
		}
		const value = property.value;
		if (!t.isLiteral(value) && !t.isIdentifier(value)) {
			return false;
		}
	}
	return true;
};

export function canRefactorStyleAttribute(styleAttribute: t.JSXAttribute):
	styleAttribute is t.JSXAttribute &
	{
		value: t.JSXExpressionContainer &
		{ expression: t.ObjectExpression & { loc: t.SourceLocation } }
	} {
	const name = styleAttribute.name;
	const value = styleAttribute.value;
	if (!t.isJSXIdentifier(name) || !t.isJSXExpressionContainer(value)) {
		return false;
	}
	const expression = value.expression;
	if (!t.isObjectExpression(expression)) {
		return false;
	}
	if (!isObjectExpressionConstantOnly(expression)) {
		return false;
	}
	if (expression.loc?.start == undefined || expression.loc.end == undefined) {
		return false;
	}
	return true;
}

export function getAllDeclaredKeyInObjectExpression(objectExpression: t.ObjectExpression): string[] {
	return objectExpression.properties
		.filter((p): p is t.ObjectProperty => t.isObjectProperty(p))
		.map((p) => p.key)
		.filter((p): p is t.Identifier => t.isIdentifier(p))
		.map(property => property.name);
}
