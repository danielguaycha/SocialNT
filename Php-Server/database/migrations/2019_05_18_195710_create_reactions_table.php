<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateReactionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('reactions', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger("user_id")->unsigned();
            $table->string('type', 100)->default("LIKE");
            $table->bigInteger("pub_id")->unsigned()->nullable();
            $table->bigInteger("market_id")->unsigned()->nullable();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');;
            $table->foreign('market_id')->references('id')->on('markets')->onDelete('cascade');
            $table->foreign('pub_id')->references('id')->on('publications')->onDelete('cascade');;
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('reactions');
    }
}
