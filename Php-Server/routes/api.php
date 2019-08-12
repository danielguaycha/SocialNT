<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});


Route::post('/market', 'MarketController@store');
Route::post('/market/{id}', 'MarketController@update');
Route::delete('/market/{id}', 'MarketController@destroy');
Route::get('/market/view/{id}', 'MarketController@view');
Route::get('/market/list/{user?}', 'MarketController@index');

//save market products

Route::post('/marketsave', 'MarketSaveController@store');
Route::get('/marketsave/{user}/{type}', 'MarketSaveController@list');
Route::delete('/marketsave/{id}', 'MarketSaveController@destroy');

Route::get('/category','CategoryController@index');