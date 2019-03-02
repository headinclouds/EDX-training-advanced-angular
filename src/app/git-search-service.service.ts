import { Injectable, Inject } from '@angular/core';
import { GitSearch } from './git-search';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/publishReplay';

@Injectable()
export class GitSearchService {
    cachedSearches: Array<{
        [query: string]: GitSearch
    }> = [];
    cachedValue: string;
    search: Observable<GitSearch>;
    constructor(private http: HttpClient) {
    }

    gitSearch: Function = (query: string): Observable<GitSearch> => {
        console.log(query, this.cachedValue, this.search);
        if (!this.search) {
            this.search = this.http.get<GitSearch>('https://api.github.com/search/repositories?q=' + query)
                .publishReplay(1)
                .refCount();
            this.cachedValue = query;
        }
        else if (this.cachedValue !== query) {
            this.search = null;
            this.gitSearch(query);
        }
        console.log(this.search, 'this.search');
        return this.search;
    }
}

