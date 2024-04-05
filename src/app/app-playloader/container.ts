import { Container } from 'inversify';
import { IDataTransformer } from './IDataTransformer';
import DataTransformer from './DataTransformer';
import DataTransformerv2 from './DataTransformerv2';

const container = new Container();
container.bind<IDataTransformer>('IDataTransformer').to(DataTransformerv2);

export default container;