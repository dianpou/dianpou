<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateRefundLogsTable extends Migration {

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('refund_logs', function(Blueprint $table)
        {
            $table->increments('id');
            $table->integer('refund_id');
            $table->string('name');
            $table->string('do');
            $table->jsonb('args')->nullable();
            $table->string('comment')->nullable();
            $table->timestamp('created_at')->default(\DB::raw('now()::timestamp(0)'));
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('refund_logs');
    }

}
