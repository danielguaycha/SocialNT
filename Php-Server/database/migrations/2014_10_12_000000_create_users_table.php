<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('name');
            $table->string('lastname')->nullable();
            $table->string("username", 100);
            $table->string('email');
			$table->string('genero',10)->nullable();
            $table->string("avatar", 150)->nullable();
            $table->string("profile", 150)->nullable();
            $table->integer("status")->default(1);
            $table->string('extrainfo', 200)->nullable();
            $table->string('hash', 200)->nullable();
            $table->string('password');
            $table->string("confirmation_code", 200)->nullable();
            $table->integer("confirmed")->default(0);
            $table->timestamp('created_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('users');
    }
}
