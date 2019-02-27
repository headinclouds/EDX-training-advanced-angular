import { Component, OnInit } from '@angular/core';
import { GitSearchService } from '../git-search.service';
import { GitSearch } from '../git-search';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AdvancedSearchModel } from '../advanced-search-model';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-git-search',
  templateUrl: './git-search.component.html',
  styleUrls: ['./git-search.component.css']
})
export class GitSearchComponent implements OnInit {
  searchResults: GitSearch;
  searchQuery: string;
  displayQuery: string;
  title: string;
  model: any;
  modelKeys: any;
  form: FormGroup;
  type: Array<any> = [];
  formControls = {};
  constructor(private GitSearchService: GitSearchService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.model = new AdvancedSearchModel('', '', '', null, null, '');
    console.log(this.model, 'model', typeof this.model.q)
    this.modelKeys = Object.keys(this.model);
    this.modelKeys.forEach((key) => {
      let validators = [];
      if (key === 'q') {
          validators.push(Validators.required);
      }
      if (key === 'stars') {
          validators.push(Validators.maxLength(4));
          validators.push(Validators.minLength(2));
      }
      if (typeof (this.model[key]) === 'string'){
        this.type.push('text');
      } else 
        this.type.push('number');

      validators.push(this.noSpecialChars);
      this.formControls[key] = new FormControl(this.model[key], validators);
    });
    this.form = new FormGroup(this.formControls);
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.searchQuery = params.get('query');
      this.displayQuery = params.get('query');
      this.gitSearch();
    })
    this.route.data.subscribe((result) => {
      this.title = result.title
    });
  }

  get q() {
    return this.form.get('q');
  }
  
  get language() {
    return this.form.get('language');
  }

  get user() {
    return this.form.get('user');
  }

  get size() {
    return this.form.get('size');
  }
  get stars() {
    return this.form.get('stars');
  }

  get topic() {
    return this.form.get('topic');
  }

  noSpecialChars(c: FormControl) {
    let REGEXP = new RegExp(/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/);

    return REGEXP.test(c.value) ? {
        validateEmail: {
        valid: false
        }
    } : null;
}

  gitSearch = () => {
    this.GitSearchService.gitSearch(this.searchQuery).then((response) => {
      this.searchResults = response;
    }, (error) => {
      alert("Error: " + error.statusText)
    })
  }

  sendQuery = () => {
    this.searchResults = null;
    let search: string = this.form.value['q'];
    let params: string = "";
    this.modelKeys.forEach((elem) => {
      if (elem === 'q') {
        return false;
      }
      if (this.form.value[elem]) {
        params += '+' + elem + ':' + this.form.value[elem];
      }
    })
    this.searchQuery = search;
    if (params !== '') {
      this.searchQuery = search + params;
    }
    this.displayQuery = this.searchQuery;
    this.router.navigate(['/search/' + this.searchQuery])
  }

}
