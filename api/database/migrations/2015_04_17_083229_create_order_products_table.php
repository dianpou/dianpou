<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateOrderProductsTable extends Migration {

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('order_products', function(Blueprint $table)
        {
            $table->increments('id');
            $table->integer('order_id');
            $table->integer('product_id');
            $table->string('sku');
            $table->string('product_name');
            $table->string('cover')->nullable();
            $table->jsonb('option');
            $table->decimal('price', 10, 2)->default(0);
            $table->decimal('tax', 10, 2)->default(0);
            $table->decimal('discount', 10, 2)->default(0);
            $table->integer('quantity');
            $table->integer('returned')->default(0);
            $table->jsonb('custom_info')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('order_products');
    }

}
