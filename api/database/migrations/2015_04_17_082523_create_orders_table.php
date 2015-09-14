<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateOrdersTable extends Migration {

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('orders', function(Blueprint $table)
        {
            $table->increments('id');
            $table->string('sn', 32)->unique();
            $table->enum('order_status', ['pending', 'confirmed', 'completed', 'branched', 'canceled'])->default('pending');
            $table->jsonb('branches')->nullable();
            $table->integer('order_lock_id')->default(0)->nullable();
            $table->decimal('order_discount', 10, 2)->default(0);
            $table->integer('user_id');
            $table->string('logistics_consignee');
            $table->jsonb('logistics_region');
            $table->string('logistics_address');
            $table->string('logistics_zipcode')->nullable();
            $table->string('logistics_mobile')->nullable();
            $table->string('logistics_phone')->nullable();
            $table->string('logistics_email')->nullable();
            $table->integer('logistics_id');
            $table->boolean('logistics_cod')->default(false);
            $table->string('logistics_tracking_number')->default('');
            $table->enum('logistics_status', ['unshipped', 'shipped'])->default('unshipped');
            $table->timestamp('logistics_time')->nullable();
            $table->integer('payment_id');
            $table->enum('payment_status', ['unpaid', 'paid'])->default('unpaid');
            $table->timestamp('payment_due')->default(\DB::raw('now()::timestamp(0) + interval \'1 day\''));
            $table->timestamp('payment_time')->nullable();
            $table->decimal('subtotal_product', 10, 2)->default(0);
            $table->decimal('subtotal_tax', 10, 2)->default(0);
            $table->decimal('subtotal_discount', 10, 2)->default(0);
            $table->decimal('subtotal_logistics', 10, 2)->default(0);
            $table->decimal('total_amount', 10, 2)->default(0);
            $table->decimal('total_refunded', 10, 2)->default(0);
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
        Schema::drop('orders');
    }

}
