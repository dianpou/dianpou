<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateRefundsTable extends Migration {

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('refunds', function(Blueprint $table)
        {
            $table->increments('id');
            $table->string('sn', 32);
            $table->integer('order_id');
            $table->integer('user_id');
            $table->decimal('total_amount', 10, 2);
            $table->string('reason')->default('')->nullable();
            $table->enum('refund_status', ['pending', 'confirmed', 'completed', 'canceled'])->default('pending');
            $table->jsonb('payment_account')->nullable();
            $table->enum('payment_status', ['unpaid', 'paid'])->default('unpaid');
            $table->timestamp('payment_time')->nullable();
            $table->enum('refund_type', ['refund', 'return', 'replace'])->default('refund');
            $table->enum('return_status', ['unreturned', 'returned'])->default('unreturned');
            $table->timestamp('return_time')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('refunds');
    }

}
