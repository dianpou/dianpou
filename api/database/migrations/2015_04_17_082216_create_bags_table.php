<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateBagsTable extends Migration {

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('bags', function(Blueprint $table)
        {
            $table->increments('id');
            $table->string('access_token');
            $table->integer('user_id')->nullable();
            $table->integer('product_id');
            $table->string('sku');
            $table->integer('quantity');
            $table->timestamps();
            $table->unique(['access_token', 'product_id', 'sku']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('bags');
    }

}
