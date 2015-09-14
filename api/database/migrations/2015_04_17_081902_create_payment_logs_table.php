<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePaymentLogsTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('payment_logs', function(Blueprint $table)
		{
			$table->increments('id');
			$table->integer('payment_id');
			$table->string('payment_sn');
			$table->decimal('payment_order_amount', 10, 2);
			$table->enum('payment_action', ['request', 'failed,', 'success']);
			$table->string('gateway_return');
			$table->timestamp('created_at');
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('payment_logs');
	}

}
