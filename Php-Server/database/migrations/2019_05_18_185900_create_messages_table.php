<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateMessagesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('messages', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger("emitter")->unsigned();
            $table->bigInteger("receiver")->unsigned();
            $table->text("text");
            $table->integer('status')->default(1);
            $table->timestamp('created_at')->nullable();

            $table->foreign("emitter")->references("id")->on("users");
            $table->foreign("receiver")->references("id")->on("users");
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('messages');
    }
}
