import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { Product, IProduct } from '../models/product';
import { ProductService } from '../service/product.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { isNullOrUndefined } from 'util';


@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit, OnDestroy {

  private observableSubscription:Array<Subscription> = [];
  formSubmitted = false;
  productForm = this.fb.group({});

  constructor(private fb:FormBuilder,
    private productService:ProductService,
    private route: ActivatedRoute,
    private router: Router
    ) { }

  ngOnInit() {
    this.productForm.addControl('id',new FormControl(''));
    this.productForm.addControl('Title',new FormControl('',[Validators.required]));
    this.productForm.addControl('Description',new FormControl('',[Validators.required]));

    const product$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
          this.productService.getProductById(Number.parseInt(params.get('id')))
        ));

        product$.subscribe(product=>{
          if(!isNullOrUndefined(product)){
            console.log(product);
            this.productForm.get('id').setValue(product.id);
            this.productForm.get('Title').setValue(product.Title);
            this.productForm.get('Description').setValue(product.Description);
          }
        })
  }

  ngOnDestroy(){
    this.observableSubscription.forEach(item => {
      item.unsubscribe();
      console.log(item, 'unsubscribed');
    });
  }

  save($event:any):void{
    this.formSubmitted = true;
    if(!this.productForm.valid){
      return;
    }

    this.saveProduct();
    // navigate back to products list
    this.router.navigate(['/products']);
  }

  saveProduct():void{
    const product =new Product();
    // map data from form to product
    product.id = this.productForm.get('id').value;
    product.Title = this.productForm.get('Title').value;
    product.Description = this.productForm.get('Description').value;

    // save to database
    if(product.id == 0){
      this.productService.addNewProduct(product);}
      else {
        this.productService.updateProduct(product);
      }
  }

}
