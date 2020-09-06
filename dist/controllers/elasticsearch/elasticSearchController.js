"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../../config"));
const elasticsearch_1 = require("@elastic/elasticsearch");
class ElasticsearchController {
    constructor() {
    }
    static PutItem(indexName, Item, ID = Item.ID) {
        return this.elasticsearchInstance.index({
            index: indexName,
            body: Item,
            id: ID
        });
    }
    static GetItem(indexName, ID) {
        return this.elasticsearchInstance.get({
            index: indexName,
            id: ID
        });
    }
    static PatchItem(indexName, Item, ID = Item.ID) {
        return this.elasticsearchInstance.update({
            index: indexName,
            id: ID,
            body: {
                script: this.generateUpdateScript(Item)
            }
        });
    }
    static search(indexName, SearchObject, page) {
        return this.elasticsearchInstance.search({
            index: indexName,
            from: page ? (page * config_1.default.elasticsearch.searchPageSize) : undefined,
            size: page ? config_1.default.elasticsearch.searchPageSize : undefined,
            body: this.generateQuery(SearchObject)
        });
    }
    static getElasticSearchEndPoint() {
        return config_1.default.elasticsearch.endpoint;
    }
    static generateUpdateScript(Item) {
    }
    static generateQuery(SearchObject) {
        return {};
    }
}
ElasticsearchController.elasticsearchInstance = new elasticsearch_1.Client({ node: ElasticsearchController.getElasticSearchEndPoint() });
exports.default = ElasticsearchController;
//# sourceMappingURL=elasticSearchController.js.map