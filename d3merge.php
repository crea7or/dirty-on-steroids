<?php

/// Class to merge core script and modules
/// Quick and dirty
class d3merge
{
	const core='d3.template.js';
	const output='result/d3.user.js';
	const devOutput='result/dev.d3.user.js';
	const gitHead='.git/HEAD';

	static public function run($arg)
	{
		chdir(dirname(__FILE__));

		$release = ($arg=='release') || (file_exists(self::gitHead) && preg_match('!/master$!', file_get_contents(self::gitHead)));
		echo ($release ? 'Release' : 'Dev')." mode\n";

		$code = strtr(file_get_contents(self::core), array
				('@buildTime@'         => date('Y-m-d H:i:s')
				,'// @corelibs@'       => self::sourcesByList('corelibs.txt')
				,'// @contentModules@' => self::sourcesByList('contentModules.txt')
				,'// @modules@'        => self::sourcesByList('modules.txt')
				,'// @jQuery@'         => file_get_contents('jquery.js')
				));

		if($release)
		{
			echo "Compressing...\n";
			require_once 'jsmin.php';
			$parts=explode('==/UserScript==',$code);
			$parts[1]=JSMin::minify($parts[1]);
			$code=implode("==/UserScript==\n",$parts);
			$output = self::output;
		}else
		{
			$output = self::devOutput;
		}

		file_put_contents($output,$code);

		echo "done.\n";
		echo "Now install ".realpath($output)." script into your browser.\n";
	}

	static protected function sourcesByList($list)
	{
		return join ("\n", array_map
				(function($file)
				{
					$full = preg_replace('![\n\r]!','',$file);
					echo "Add $full\n";
					return file_exists($full) ? file_get_contents($full) : '//'.$full;
				}
				,file($list)));
	}
}

d3merge::run(@$argv[1]);
