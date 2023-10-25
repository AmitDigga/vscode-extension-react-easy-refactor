import * as babel from '@babel/core';
import * as t from '@babel/types';
export type P<T> = babel.NodePath<T>;


export function isIdentifierPath(path: P<t.Node | null | undefined>): path is P<t.Identifier> {
    return t.isIdentifier(path.node);
}

export function isObjectExpressionPath(path: P<t.Node | null | undefined>): path is P<t.ObjectExpression> {
    return t.isObjectExpression(path.node);
}

export function isCallExpressionPath(path: P<t.Node | null | undefined>): path is P<t.CallExpression> {
    return t.isCallExpression(path.node);
}

export function isMemberExpressionPath(path: P<t.Node | null | undefined>): path is P<t.MemberExpression> {
    return t.isMemberExpression(path.node);
}

export function isVariableDeclarationPath(path: P<t.Node | null | undefined>): path is P<t.VariableDeclaration> {
    return t.isVariableDeclaration(path.node);
}

export function isVariableDeclarationPathWithKind(path: P<t.Node | null | undefined>, kind: t.VariableDeclaration['kind']): path is P<t.VariableDeclaration> {
    return isVariableDeclarationPath(path) && path.node.kind === kind;
}

export function isVariableDeclarator(path: P<t.Node | null | undefined>): path is P<t.VariableDeclarator> {
    return t.isVariableDeclarator(path.node);
}