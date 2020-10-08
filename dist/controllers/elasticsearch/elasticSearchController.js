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
            from: (typeof page === typeof 1) ? (page * config_1.default.elasticsearch.searchPageSize) : 0,
            size: (typeof page === typeof 1) ? config_1.default.elasticsearch.searchPageSize : 999,
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
        (SearchObject['matchers'] || []).forEach((q, index) => {
            // if(index == 0)
            //     query = query.query(q.type, q.feild, q.value);
            // else
            query = query.orQuery(q.type, q.feild, q.value);
        });
        (SearchObject['filters'] || []).forEach((q) => {
            if (q.value instanceof Array) {
                q.value.forEach((val) => {
                    query = query.orFilter(q.type, q.feild, val);
                });
            }
            else {
                query = query.filter(q.type, q.feild, q.value);
            }
        });
        (SearchObject['exists'] || []).forEach((q) => {
            query = query.query('exists', q);
        });
        (SearchObject['sort'] || []).forEach((q) => {
            query = query.sort(q.feild, q.order || 'desc');
        });
        (SearchObject['not'] || []).forEach((q) => {
            query = query.notFilter('match', q.feild, q.value);
        });
        let result = query.build();
        if (Object.keys(result).length == 0)
            result = bodybuilder_1.default()
                .query('match_all')
                .build();
        console.log(JSON.stringify(result));
        return result;
    }
}
ElasticsearchController.elasticsearchInstance = new elasticsearch_1.Client({ node: ElasticsearchController.getElasticSearchEndPoint() });
exports.default = ElasticsearchController;
//# sourceMappingURL=elasticSearchController.js.map