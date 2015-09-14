<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUploadFilesTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('upload_files', function(Blueprint $table)
		{
			$table->increments('id');
			$table->string('file_name');
			$table->string('file_type');
			$table->string('file_path');
			$table->integer('file_size');
			$table->timestamp('created_at')->default(DB::raw('now()::timestamp(0)'));
			$table->unique('file_path');
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('upload_files');
	}

}
