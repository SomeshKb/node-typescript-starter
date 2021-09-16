import { REDIS_PASSWORD, REDIS_URL } from "../util/secrets";
import * as redis from "redis";

let client: redis.RedisClient = null;
export const redisInitialize = () => {

    client = redis.createClient(
        {
            host: REDIS_URL,
            port: 15230,
            password: REDIS_PASSWORD
        }
    );
};

export const setData = (key: string, userData: any) => {
    return new Promise((resolve, reject) => {
        client.set(key, JSON.stringify(userData), (err: redis.RedisError, result: string) => {
            if (!err) {
                client.expire(key, 3600, (err,result) => {
                    if (!err) {
                        resolve(result);
                    } else {
                        reject(err);
                    }
                });
            } else {
                reject(err);
            }
        });
    });

};

export const setExpiry = (key: string) => {
    return new Promise((resolve, reject) => {
        const expireTime = Math.trunc((new Date().getTime()/1000 )+ 3600);
        client.expireat(key, expireTime, (err: redis.RedisError, expireResult: any) => {
            if (!err) {
                resolve(expireResult);
            } else {
                reject(err);
            }
        });
    });
};


export const getData = (key: string) => {
    return new Promise((resolve, reject) => {
        client.get(key, (err: redis.RedisError, result: any) => {
            if (!err && result) {
                setExpiry(key).then(()=>{
                    resolve(result);
                },err=>{
                    reject(err);
                });
            } else {
                reject(err);
            }
        });
    });

};
export const deleteData = (key: string) => {
    return new Promise((resolve, reject) => {
        client.del(key, (err: redis.RedisError, result: any) => {
            if (!err) {
                resolve(result);
            } else {
                reject(err);
            }
        });
    });
};
