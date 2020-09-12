"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../../config"));
const elasticsearch_1 = require("@elastic/elasticsearch");
const bodybuilder_1 = __importDefault(require("bodybuilder"));
class ElasticsearchController {
    constructor() {
    }
    static insertItem(indexName, Item, ID = Item.ID) {
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
                script: {
                    source: this.generateUpdateScript(Item),
                    lang: "painless",
                    params: Item
                }
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
        let script = "";
        Object.keys(Item).forEach((key) => {
            script += `ctx._source.${key} = params.${key};`;
        });
        return script;
    }
    static generateQuery(SearchObject) {
        let query = bodybuilder_1.default();
        (SearchObject['filter'] || []).forEach((q) => {
            query = query.filter(q.type, q.feild, q.value);
        });
        return query.build();
    }
}
ElasticsearchController.elasticsearchInstance = new elasticsearch_1.Client({ node: ElasticsearchController.getElasticSearchEndPoint() });
exports.default = ElasticsearchController;
//# sourceMappingURL=elasticSearchController.js.map