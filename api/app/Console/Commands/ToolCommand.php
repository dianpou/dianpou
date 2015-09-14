<?php namespace App\Console\Commands;

use Illuminate\Console\Command;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Input\InputArgument;
use GuzzleHttp\Client as HttpClient;
use Storage;
use App\Models\Region;

class ToolCommand extends Command {

	/**
	 * The console command name.
	 *
	 * @var string
	 */
	protected $name = 'tool:region';

	/**
	 * The console command description.
	 *
	 * @var string
	 */
	protected $description = 'get lastest regoin data form gov';

	/**
	 * Create a new command instance.
	 *
	 * @return void
	 */
	public function __construct()
	{
		error_reporting(E_ALL ^ E_NOTICE ^ E_DEPRECATED ^ E_STRICT);
		parent::__construct();
	}

	/**
	 * Execute the console command.
	 *
	 * @return mixed
	 */
	public function fire()
	{
		$client  = new HttpClient();
		$provinces = json_decode('[{"children":[],"diji":"","quHuaDaiMa":"110000","quhao":"","shengji":"北京市(京)","xianji":""},{"children":[],"diji":"","quHuaDaiMa":"120000","quhao":"","shengji":"天津市(津)","xianji":""},{"children":[],"diji":"","quHuaDaiMa":"130000","quhao":"","shengji":"河北省(冀)","xianji":""},{"children":[],"diji":"","quHuaDaiMa":"140000","quhao":"","shengji":"山西省(晋)","xianji":""},{"children":[],"diji":"","quHuaDaiMa":"150000","quhao":"","shengji":"内蒙古自治区(内蒙古)","xianji":""},{"children":[],"diji":"","quHuaDaiMa":"210000","quhao":"","shengji":"辽宁省(辽)","xianji":""},{"children":[],"diji":"","quHuaDaiMa":"220000","quhao":"","shengji":"吉林省(吉)","xianji":""},{"children":[],"diji":"","quHuaDaiMa":"230000","quhao":"","shengji":"黑龙江省(黑)","xianji":""},{"children":[],"diji":"","quHuaDaiMa":"310000","quhao":"","shengji":"上海市(沪)","xianji":""},{"children":[],"diji":"","quHuaDaiMa":"320000","quhao":"","shengji":"江苏省(苏)","xianji":""},{"children":[],"diji":"","quHuaDaiMa":"330000","quhao":"","shengji":"浙江省(浙)","xianji":""},{"children":[],"diji":"","quHuaDaiMa":"340000","quhao":"","shengji":"安徽省(皖)","xianji":""},{"children":[],"diji":"","quHuaDaiMa":"350000","quhao":"","shengji":"福建省(闽)","xianji":""},{"children":[],"diji":"","quHuaDaiMa":"360000","quhao":"","shengji":"江西省(赣)","xianji":""},{"children":[],"diji":"","quHuaDaiMa":"370000","quhao":"","shengji":"山东省(鲁)","xianji":""},{"children":[],"diji":"","quHuaDaiMa":"410000","quhao":"","shengji":"河南省(豫)","xianji":""},{"children":[],"diji":"","quHuaDaiMa":"420000","quhao":"","shengji":"湖北省(鄂)","xianji":""},{"children":[],"diji":"","quHuaDaiMa":"430000","quhao":"","shengji":"湖南省(湘)","xianji":""},{"children":[],"diji":"","quHuaDaiMa":"440000","quhao":"","shengji":"广东省(粤)","xianji":""},{"children":[],"diji":"","quHuaDaiMa":"450000","quhao":"","shengji":"广西壮族自治区(桂)","xianji":""},{"children":[],"diji":"","quHuaDaiMa":"460000","quhao":"","shengji":"海南省(琼)","xianji":""},{"children":[],"diji":"","quHuaDaiMa":"500000","quhao":"","shengji":"重庆市(渝)","xianji":""},{"children":[],"diji":"","quHuaDaiMa":"510000","quhao":"","shengji":"四川省(川、蜀)","xianji":""},{"children":[],"diji":"","quHuaDaiMa":"520000","quhao":"","shengji":"贵州省(黔、贵)","xianji":""},{"children":[],"diji":"","quHuaDaiMa":"530000","quhao":"","shengji":"云南省(滇、云)","xianji":""},{"children":[],"diji":"","quHuaDaiMa":"540000","quhao":"","shengji":"西藏自治区(藏)","xianji":""},{"children":[],"diji":"","quHuaDaiMa":"610000","quhao":"","shengji":"陕西省(陕、秦)","xianji":""},{"children":[],"diji":"","quHuaDaiMa":"620000","quhao":"","shengji":"甘肃省(甘、陇)","xianji":""},{"children":[],"diji":"","quHuaDaiMa":"630000","quhao":"","shengji":"青海省(青)","xianji":""},{"children":[],"diji":"","quHuaDaiMa":"640000","quhao":"","shengji":"宁夏回族自治区(宁)","xianji":""},{"children":[],"diji":"","quHuaDaiMa":"650000","quhao":"","shengji":"新疆维吾尔自治区(新)","xianji":""},{"children":[],"diji":"","quHuaDaiMa":"810000","quhao":"0852","shengji":"香港特别行政区(港)","xianji":""},{"children":[],"diji":"","quHuaDaiMa":"820000","quhao":"0853","shengji":"澳门特别行政区(澳)","xianji":""},{"children":[],"diji":"","quHuaDaiMa":"710000","quhao":"","shengji":"台湾省(台)","xianji":""}]', true);
		foreach ($provinces as $province) {
			preg_match_all('/(.*?)\((.*?)\)/', $province['shengji'], $matched);
			$region = new Region(array(
				'region_name' => $matched[1][0],
				'region_code' => $province['quHuaDaiMa'],
				'parent_id'	  => 0,
				'extra_attrs' => array(
					'shortened' => $matched[2][0],
				),
			));
			$region->save();
			echo $region->region_name . "...\r\n";
			$cities = json_decode($client->post('http://202.108.98.30/selectJson',
								  array('headers'=> ['Content-Type'=>'application/x-www-form-urlencoded; charset=UTF-8'],
								  		'body' => 'shengji=' . $province['shengji']))->getBody()->read(10240000), true);
			foreach ($cities as $c) {
				$city = new Region(array(
					'region_name' => $c['diji'],
					'region_code' => $c['quHuaDaiMa'],
				));
				$city = $region->children()->save($city);
				$dists = json_decode($client->post('http://202.108.98.30/selectJson',
									  array('headers'=> ['Content-Type'=>'application/x-www-form-urlencoded; charset=UTF-8'],
									  		'body' => 'shengji=' . $province['shengji'] . '&diji=' . $c['diji']))->getBody()->read(10240000), true);
				foreach ($dists as $d) {
					$dist = new Region(array(
						'region_name' => $d['xianji'],
						'region_code' => $d['quHuaDaiMa'],
						'extra_attrs' => array(
							'area_code' =>	$d['quhao'],
						),
					));
					$city->children()->save($dist);

				}
			}
		}
		echo 'done';
	}

	/**
	 * Get the console command arguments.
	 *
	 * @return array
	 */
	protected function getArguments()
	{
		return [];
	}

	/**
	 * Get the console command options.
	 *
	 * @return array
	 */
	protected function getOptions()
	{
		return [];
	}
}
