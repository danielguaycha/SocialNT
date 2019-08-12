<?php

namespace App\Http\Controllers;

use App\Market;
use Illuminate\Http\Request;

class MarketController extends Controller
{
    public function store(Request $request){
        // validación de la entrada
        if(!$request->has('user_id') || !$request->has('title')
            || !$request->has('price') || !$request->has('category_id')){
            return response()->json(['ok'=> false, 'message'=> 'Complete el formulario para continuar'], 400);
        }

        $m = new Market();
        $m->title = $request->title;
        $m->price = $request->price;
        $m->description = $request->description;
        $m->user_id = $request->user_id;
        $m->category_id = $request->category_id;
        $m->dir = $request->dir;
        if($request->file('image')){
            $m->image = AdminController::uploadImage($request->file('image'), 'img/publications', []);
        } else {
            $m->image = 'img/product.jpg';
        }

        if($m->save()){
            return response()->json(['ok'=> true, 'data' =>  $m ]);
        }

        return response()->json(['ok'=> false, 'message'=> 'No se ha podido guardar tu publicación, reintenta'], 400);
    }

    public function update(Request $request, $id){
        $m = Market::find($id);
        if(!$m) return response()->json(['ok'=> false, 'message'=> 'No se encontró esta publicación']);

        if($request->has('title'))
            $m->title = $request->title;
        if($request->has('price'))
            $m->price = $request->price;
        if($request->has('description'))
            $m->description = $request->description;
        if($request->has('user_id'))
            $m->user_id = $request->user_id;
        if($request->has('category_id'))
            $m->category_id = $request->category_id;
        if($request->has('dir'))
            $m->dir = $request->dir;

        if($request->hasFile('image')){
            AdminController::removeImage($m->image);
            $m->image = AdminController::uploadImage($request->file('image'), 'img/publications', []);
        }

        if($m->save()){
           return response()->json(['ok'=> false, 'data'=> $m]);
        }

        return response()->json(['ok'=> false, 'message'=> 'No se ha podido actualizar tu publicación, reintenta'], 400);
    }

    public function destroy($id){
        $m = Market::find($id);
        if(!$m) return response()->json(['ok'=> false, 'message'=> 'No se encontró esta publicación']);

        if($m->image !== null && $m->image !== 'img/product.jpg')
            AdminController::removeImage($m->image);

        if($m->delete()){
            return response()->json(['ok'=> true, 'message'=> 'Publicación eliminada con éxito']);
        }
        return response()->json(['ok'=> false, 'message'=> 'No se ha podido eliminar tu publicación, reintenta'], 400);
    }

    public function index(Request $request, $user = null ) {

        $page = 1;
        $limit = 10;

        if($request->query('page'))
            $page = $request->query('page');

        if($request->query('limit'))
            $limit = $request->query('limit');

        $offset = ($page-1) * $limit;

        $where = [0 => '1 = ?', 1 => 1];

        if($request->query('c'))
            $where = [ 'category_id = ?', [$request->query('c')] ];

        if($request->query('q'))
            $where = ['title like ? or categories.name like ?',
                ['%'.$request->query('q').'%', '%'.$request->query('q').'%']
            ];
        if($request->query('u'))
            $where = ['user_id = ?',  [ $request->query('u') ] ];

        $r = Market::join('categories', 'categories.id', 'markets.category_id')
                    ->select('categories.name as category', 'markets.*')
                    ->whereRaw($where[0], $where[1])
                    ->limit($limit)->offset($offset)
                    ->orderBy('created_at', 'desc')
                    ->get();

        return response()->json(['ok'=> true, 'data' => MarketSaveController::validateMarkets($r, $user)]);
    }

    public function view($id){
        $m = Market::where('markets.id', $id)
            ->join('users', 'users.id', 'markets.user_id')
            ->join('categories', 'categories.id', 'markets.category_id')
            ->select('markets.*', 'users.name', 'users.lastname', 
                        'users.avatar', 'users.username', 'users.id as user',
                        'categories.name as category')
            ->first();

        if(!$m) return response()->json(['ok'=> false, 'message'=> 'No se encontró esta publicación']);

        return response()->json(['ok'=> true, 'data'=> $m]);
    }

}
