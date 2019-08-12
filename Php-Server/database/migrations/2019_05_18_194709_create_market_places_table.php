<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateMarketPlacesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('markets', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string("title");
            $table->decimal("price", 12, 2);
            $table->text("description")->nullable();
            $table->string("image")->nullable();
            $table->string('dir')->nullable();

            $table->bigInteger("user_id")->unsigned();
            $table->bigInteger("category_id")->unsigned();

            $table->timestamps();

            $table->foreign("user_id")->references("id")->on("users");
            $table->foreign("category_id")->references("id")->on("categories")->onDelete("Cascade");
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('markets');
    }
}
