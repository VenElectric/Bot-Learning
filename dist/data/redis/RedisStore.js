"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseClass_1 = __importDefault(require("../../utilities/BaseClass"));
const redis = require("redis");
require("dotenv").config();
class RedisInstance extends BaseClass_1.default {
    constructor(sonic) {
        super(sonic);
        this.redisURL = process.env.REDISCLOUD_URL;
        this.client = redis.createClient({
            url: this.redisURL,
            no_ready_check: true,
        });
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.client.connect();
            this.log("initiating redis client", this.info, this.init.name);
            this.client.on("error", (err) => this.onError(err, "Uncaught Redis Error"));
        });
    }
    push(key, item) {
        return __awaiter(this, arguments, void 0, function* () {
            try {
                yield this.client.RPUSH(key, JSON.stringify(item));
                this.log("successfully pushed item to array on redis store", this.info, this.push.name);
            }
            catch (error) {
                this.onError(error, this.push.name, ...arguments);
            }
        });
    }
    retrieveArray(key) {
        return __awaiter(this, arguments, void 0, function* () {
            try {
                const redisArray = yield this.client.LRANGE(key, 0, -1);
                this.log("successfully retrieving array items", this.info, this.retrieveArray.name);
                return redisArray;
            }
            catch (error) {
                this.onError(error, this.push.name, ...arguments);
                return [];
            }
        });
    }
}
exports.default = RedisInstance;
