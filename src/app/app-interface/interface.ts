import { injectable, inject } from 'inversify';
import 'reflect-metadata';

export const TYPES = {
    IPdfComparator: Symbol.for('IPdfComparator'),
};

export interface IPdfComparator { 
    comparePdfFiles(folder1: string, folder2: string): Promise<boolean>;
}