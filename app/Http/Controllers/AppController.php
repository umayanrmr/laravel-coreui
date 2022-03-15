<?php

namespace App\Http\Controllers;


use Illuminate\Support\Facades\App;

class AppController extends Controller
{
    public function index() {
        if (config('app.env') != 'PRODUCTION') {
            return view('dev'); // this will load resources/views/dev.blade.php
        }
        return view('app');  // this will load resources/views/app.blade.php, app.blade.php will be auto generated when you run ```npm run build```
    }
}
