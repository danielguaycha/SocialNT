<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Image;

class AdminController extends Controller
{

    static function removeImage($path){
        try{
            if (file_exists(public_path($path))) {
                unlink(public_path($path));
            }
        } catch (\Exception $e){}
    }

    static function uploadImage($image, $path, $options = null)
    {
        if (!file_exists($path)) {
            mkdir($path, 666, true);
        }
        if(!$image || $image == null)
            return '';
        $input['imagename'] = time().'.'.$image->getClientOriginalExtension();
        $destinationPath = public_path($path .'/'. $input['imagename']);
        $img = Image::make($image->getRealPath());

        if($options!=null){
            if(isset($options['width']) and isset($options['height'])){
                $img->resize($options['width'], $options['height']);
            }
        }
        $img->save($destinationPath);
        return $path."/".$input['imagename'];
    }
}
