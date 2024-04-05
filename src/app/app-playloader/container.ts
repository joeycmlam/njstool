import { Container } from 'inversify';
import { IDataTransformer } from './IDataTransformer';
import DataTransformer from './DataTransformer';

const container = new Container();
container.bind<IDataTransformer>('IDataTransformer').to(DataTransformer);

export default container;