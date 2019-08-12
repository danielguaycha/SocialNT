<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Category;

class CategoryController extends Controller
{
    public function index(){
        $c = Category::all();
        return response()->json(['ok'=> true,  'data'=> $c ]);
    }
}
