<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateOrderLogsTable extends Migration {

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('order_logs', function(Blueprint $table)
        {
            $table->increments('id');
            $table->integer('order_id');
            $table->string('name');
            $table->string('do');
            $table->jsonb('args')->default('{}');
            $table->string('comment')->nullable()->default('');
            $table->datetime('created_at')->default(DB::raw('now()'));
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('order_logs');
    }

}
