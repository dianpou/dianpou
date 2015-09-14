<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateProductStocksTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('product_stocks', function(Blueprint $table)
		{
			$table->increments('id');
			$table->integer('product_id');
			$table->jsonb('option')->default('[]');
			$table->string('sku')->unique();
			$table->integer('stocks');
			$table->decimal('price', 10, 2);
			$table->integer('cover_id')->default(0);
			$table->unique(['product_id', 'option']);
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('product_stocks');
	}

}
