<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateNotificationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('notifications', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string("type"); // like, commnet, message
            $table->string("description", 255);
            $table->bigInteger("to")->unsigned(); // para quien es la publicacion
            $table->bigInteger("from")->unsigned(); // quien la generó
            $table->string('url', 200)->nullable(); // url donde vamos
            $table->biginteger('resource_id'); // id de la publicacion o del market
            $table->string('resource'); // publicacion, marketplace
            $table->integer('status')->default(1); // 1 no leido, 0 leido
            
            $table->timestamp('created_at')->nullable();
            $table->foreign("to")->references("id")->on("users");
            $table->foreign("from")->references("id")->on("users");
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('notifications');
    }
}
