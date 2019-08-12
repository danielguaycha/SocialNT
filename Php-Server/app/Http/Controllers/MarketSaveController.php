<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\MarketSave;

class MarketSaveController extends Controller
{
    public function index(Request $request){

    }

    public function store(Request $request){
        if(! $request->has('user_id') || !$request->has('market_id') || !$request->has('type')){
            return response()->json(['ok'=> false, 'message'=> 'Complete el Request']);
        }
    
        $exist = MarketSave::where([
            ['user_id', $request->user_id],
            ['market_id', $request->market_id],
            ['type', $request->type]
        ])->first();

        if ($exist) {
            return response()->json(['ok'=> true, 'data' => $exist]);
        }

        $m = new MarketSave();
        $m->user_id = $request->user_id;
        $m->market_id = $request->market_id;
        $m->type = strtoupper($request->type);

        if ($m->save()) {
            return response()->json(['ok'=> true, 'data' => $m]);
        }
        return response()->json(['ok'=> false, 'message'=> 'No se pudo guardar los datos']);
    }

    public function list(Request $request, $user, $type){
        $page = 1;
        $limit = 10;

        if($request->query('page'))
            $page = $request->query('page');

        if($request->query('limit'))
            $limit = $request->query('limit');

        $offset = ($page-1) * $limit;

        $m = MarketSave::where('market_saves.user_id', $user)
            ->where('type', strtoupper($type))
            ->join('markets', 'markets.id', 'market_saves.market_id')
            ->select('markets.*', 'market_saves.id as market_save')
            ->limit($limit)->offset($offset)
                    ->orderBy('created_at', 'desc')
                    ->get();
        return response()->json(['ok'=> true, 'data'=> self::validateMarkets($m, $user)]);
    }

    public function destroy($id){
        $m = MarketSave::find($id);
        if(!$m) return response()->json(['ok'=> false, 'message'=> 'No se encontró esta publicación']);    

        if($m->delete()){
            return response()->json(['ok'=> true, 'message'=> 'Publicación eliminada con éxito']);
        }
        return response()->json(['ok'=> false, 'message'=> 'No se ha podido eliminar tu publicación, reintenta'], 400);
    }

    static function isSaved($user, $marketId){
        return MarketSave::where([
                ['user_id', $user],
                ['market_id', $marketId],
                ['type', 'SAVE']
            ])->exists();
    }

    static function validateMarkets($markets, $user){
        foreach($markets as $dato){
            if($user){
                $val = MarketSaveController::isSaved($user, $dato->id);
                if($val){
                    $dato->isSaved = true;
                } else {
                    $dato->isSaved = false;
                }
            } else {
                $dato->isSaved = false;
            }
        }
        return $markets;
    }
}
